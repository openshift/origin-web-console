'use strict';

angular
  .module('openshiftConsole')
  .controller('MembershipController',
    function(
      $filter,
      $location,
      $routeParams,
      $scope,
      $timeout,
      $uibModal,
      AuthService,
      AuthorizationService,
      DataService,
      ProjectsService,
      MembershipService,
      RoleBindingsService,
      RolesService) {

      var requestContext;
      var projectName = $routeParams.project;
      var humanizeKind = $filter('humanizeKind');
      var annotation = $filter('annotation');

      var allRoles = [];

      // NOTE: these could all be moved out into a strings service.
      var messages = {
        errorReason: _.template('Reason: "<%- httpErr %>"'),
        notice: {
          yourLastRole: _.template('Removing the role "<%- roleName %>" may completely remove your ability to see this project.')
        },
        warning: {
          serviceAccount: _.template('Removing a system role granted to a service account may cause unexpected behavior.')
        },
        remove: {
          areYouSure: {
            subject: _.template('Are you sure you want to remove <strong><%- roleName %></strong> from the <%- kindName %> <strong><%- subjectName %></strong>?'),
            self: _.template('Are you sure you want to remove <strong><%- roleName %></strong> from <strong><%- subjectName %></strong> (you)?')
          },
          success: _.template('The role "<%- roleName %>" was removed from "<%- subjectName %>".'),
          error: _.template('The role "<%- roleName %>" was not removed from "<%- subjectName %>".')
        },
        update: {
          subject: {
            success: _.template('The role "<%- roleName %>" was given to "<%- subjectName %>".'),
            error: _.template('The role "<%- roleName %>" was not given to "<%- subjectName %>".')
          }
        }
      };

      // NOTE: alert service?
      var showAlert = function(name, type, msg, detail, scope) {
        scope = scope || $scope;
        scope.alerts[name] = {
          type: type,
          message: msg,
          details: detail
        };
      };

      var resetForm = function() {
        $scope.disableAddForm = false;
        $scope.newBinding.name = '';
        $scope.newBinding.namespace = projectName;
        $scope.newBinding.newRole = null;
      };

      var refreshRoleBindingList = function() {
        DataService
          .list('rolebindings', requestContext, function(resp) {
            angular.extend($scope, {
              canShowRoles: true,
              roleBindings: resp.by('metadata.name'),
              subjectKindsForUI: MembershipService.mapRolebindingsForUI(resp.by('metadata.name'), allRoles)
            });
          }, {
            errorNotification: false
          });
      };

      var createBinding = function(role, newSubject) {
        $scope.disableAddForm = true;

        RoleBindingsService
          .create(role, newSubject, projectName, requestContext)
          .then(function() {
            resetForm();
            refreshRoleBindingList();
            showAlert('rolebindingCreate', 'success', messages.update.subject.success({
              roleName: role.metadata.name,
              subjectName: _.escape(newSubject.name)
            }));
          }, function(err) {
            resetForm();
            showAlert('rolebindingCreateFail', 'error', messages.update.subject.error({
              roleName: role.metadata.name,
              subjectName: _.escape(newSubject.name)
            }), messages.errorReason({httpErr: $filter('getErrorDetails')(err)}));
          });
      };

      var updateBinding = function(rb, newSubject, projectName) {
        $scope.disableAddForm = true;
        RoleBindingsService
          .addSubject(rb, newSubject, projectName, requestContext)
          .then(function() {
            resetForm();
            refreshRoleBindingList();
            showAlert('rolebindingUpdate', 'success', messages.update.subject.success({
              roleName: rb.roleRef.name,
              subjectName: _.escape(newSubject.name)
            }));
          }, function(err) {
            resetForm();
            showAlert('rolebindingUpdateFail', 'error', messages.update.subject.error({
              roleName: rb.roleRef.name,
              subjectName: _.escape(newSubject.name)
            }), messages.errorReason({httpErr: $filter('getErrorDetails')(err)}));
          });
      };

      var selectedTab = {};
      if($routeParams.tab) {
        selectedTab[$routeParams.tab] = true; // ex: tab=Group for Groups, pluralized in the template
      }

      var subjectKinds = MembershipService.getSubjectKinds();

      // initial scope setup
      angular.extend($scope, {
        selectedTab: selectedTab,
        projectName: projectName,
        alerts: {},
        forms: {},
        emptyMessage: 'Loading...',
        subjectKinds: subjectKinds,
        newBinding: {
          role: '',
          kind: $routeParams.tab || 'User',
          name: ''
        },
        toggleEditMode: function() {
          resetForm();
          $scope.mode.edit = !$scope.mode.edit;
        },
        mode: {
          edit: false
        },
        selectTab: function(selected) {
          $scope.newBinding.kind = selected;
        }
      });

      // filter functions not generic enough to be created as standard filters
      angular.extend($scope, {
        excludeExistingRoles: function(subjectRoles) {
          return function(role) {
            return !_.some(subjectRoles, {kind: role.kind, metadata: {name: role.metadata.name}});
          };
        },
        roleHelp: function(role) {
          if(!role) {
            return;
          }
          var noInfoMessage = 'There is no additional information about this role.';
          var namespace = _.get(role, 'metadata.namespace');
          var name = _.get(role, 'metadata.name');
          var prefix = namespace ? (namespace + ' / ' + name + ': ') : '';
          return role ?
                  prefix + (annotation(role, 'description') || noInfoMessage) :
                  noInfoMessage;
        }
      });

      var createModalScope = function(subjectName, kind, roleName, currentUserName) {
        var modalScope = {
          alerts: {},
          detailsMarkup: messages.remove.areYouSure.subject({
            roleName: roleName,
            kindName: humanizeKind(kind),
            subjectName:  _.escape(subjectName)
          }),
          okButtonText: 'Remove',
          okButtonClass: 'btn-danger',
          cancelButtonText: 'Cancel'
        };
        if(_.isEqual(subjectName, currentUserName)) {
          modalScope.details = messages.remove.areYouSure.self({
            roleName: roleName,
            subjectName: _.escape(subjectName)
          });
          if(MembershipService.isLastRole($scope.user.metadata.name, $scope.roleBindings)) {
            showAlert('currentUserLastRole', 'error', messages.notice.yourLastRole({roleName: roleName}), null, modalScope);
          }
        }
        if(_.isEqual(kind, 'ServiceAccount') && _.startsWith(roleName, 'system:')) {
          showAlert('editingServiceAccountRole', 'error', messages.warning.serviceAccount(), null, modalScope);
        }
        return modalScope;
      };

      AuthService
        .withUser()
        .then(function(resp) {
          $scope.user = resp;
        });


      DataService.list('projects', {}, function(resp) {
        angular.extend($scope, {
          projects: _.map(resp.by('metadata.name'), function(project) {
            return project.metadata.name;
          })
        });
      });

      ProjectsService
        .get($routeParams.project)
        .then(_.spread(function(project, context) {
          requestContext = context;
          refreshRoleBindingList();
          angular.extend($scope, {
            project: project,
            subjectKinds: subjectKinds,
            confirmRemove: function(subjectName, kindName, roleName) {
              var redirectToProjectList = null;
              var modalScope = createModalScope(subjectName, kindName, roleName, $scope.user.metadata.name);
              if(_.isEqual(subjectName, $scope.user.metadata.name)) {
                if(MembershipService.isLastRole($scope.user.metadata.name, $scope.roleBindings)) {
                  redirectToProjectList = true;
                }
              }
              $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/confirm.html',
                controller: 'ConfirmModalController',
                resolve: {
                  modalConfig: function() {
                    return modalScope;
                  }
                }
              })
              .result.then(function() {
                RoleBindingsService
                  .removeSubject(subjectName, roleName, $scope.roleBindings, requestContext)
                  .then(function() {
                    if(redirectToProjectList) {
                      $location.url("./");
                    } else {
                      refreshRoleBindingList();
                      showAlert('rolebindingUpdate', 'success', messages.remove.success({
                        roleName: roleName,
                        subjectName: _.escape(subjectName)
                      }));
                    }
                  }, function(err) {
                    showAlert('rolebindingUpdateFail', 'error', messages.remove.error({
                      roleName: roleName,
                      subjectName: _.escape(subjectName)
                    }),  messages.errorReason({
                      httpErr: $filter('getErrorDetails')(err)
                    }));
                  });
              });
            },
            // subjectNamespace is only needed for service accounts, thus it is last and optional
            addRoleTo:function(subjectName, subjectKind, role, subjectNamespace) {
              var subject = {
                name: subjectName,
                kind: subjectKind,
                namespace: subjectNamespace
              };
              // TODO (bpeterse): future. Role/ClusterRole roleRef disambiguation
              // Edge case a user creates a local Role with same name as ClusterRole,
              // roleRef doesn't necessarily contain namespace. There may be a way to
              // infer this, but isn't clear at the moment.  Will fast-follow PR if
              // a good solution is found.
              var rolebindingToUpdate = _.find($scope.roleBindings, {roleRef: {name: role.metadata.name}});

              if(rolebindingToUpdate) {
                return updateBinding(rolebindingToUpdate, subject, subjectNamespace);
              }
              return createBinding(role, subject, subjectNamespace);
            }
          });

          // both clusterRoles and local roles are needed, though local are rare
          RolesService
            .listAllRoles(requestContext, {
              errorNotification: false
            })
            .then(function(resp) {
              // TODO: this should be by UID, not by Kind-Name, would be less janky.
              // The only catch is matching them up w/Rolebindings, which do not have
              // the UID
              allRoles = MembershipService.mapRolesForUI(_.first(resp), _.last(resp));
              var sortedRoles = MembershipService.sortRoles(allRoles);
              var filteredRoles = MembershipService.filterRoles(allRoles);
              var includesRole = function(roleName, roles) {
                return _.some(roles, { metadata: { name: roleName } });
              };
              refreshRoleBindingList();
              angular.extend($scope, {
                toggle: {
                  roles: false
                },
                filteredRoles: filteredRoles,
                showAllRoles: function() {
                  $scope.toggle.roles = !$scope.toggle.roles;
                  if($scope.toggle.roles) {
                    $scope.filteredRoles = sortedRoles;
                  } else {
                    $scope.filteredRoles = filteredRoles;
                    if(!includesRole($scope.newBinding.role, filteredRoles)) {
                      $scope.newBinding.role = null;
                    }
                  }
                }
              });
            });
        }));
    });
