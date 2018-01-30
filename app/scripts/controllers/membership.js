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
      APIService,
      AuthService,
      AuthorizationService,
      DataService,
      ProjectsService,
      MembershipService,
      NotificationsService,
      RoleBindingsService,
      RolesService) {

      var requestContext;
      var projectName = $routeParams.project;
      var humanizeKind = $filter('humanizeKind');
      var annotation = $filter('annotation');
      var canI = $filter('canI');

      var serviceAccountVersion = APIService.getPreferredVersion('serviceaccounts');
      $scope.roleBindingsVersion = APIService.getPreferredVersion('rolebindings');

      var allRoles = [];

      var messages = {
        notice: {
          yourLastRole: _.template('Removing the role "<%= roleName %>" may completely remove your ability to see this project.')
        },
        warning: {
          serviceAccount: _.template('Removing a system role granted to a service account may cause unexpected behavior.')
        },
        remove: {
          areYouSure: {
            html: {
              subject: _.template('Are you sure you want to remove <strong><%- roleName %></strong> from the <%- kindName %> <strong><%- subjectName %></strong>?'),
              self: _.template('Are you sure you want to remove <strong><%- roleName %></strong> from <strong><%- subjectName %></strong> (you)?')
            }
          },
          success: _.template('The role "<%= roleName %>" was removed from "<%= subjectName %>".'),
          error: _.template('The role "<%= roleName %>" was not removed from "<%= subjectName %>".')
        },
        update: {
          subject: {
            success: _.template('The role "<%= roleName %>" was granted to "<%= subjectName %>".'),
            error: _.template('The role "<%= roleName %>" could not be granted to "<%= subjectName %>".'),
            exists: _.template('The role "<%= roleName %>" has already been granted to "<%= subjectName %>".')
          }
        }
      };

      var showToast = function(type, message, details) {
        NotificationsService.addNotification({
          type: type,
          message: message,
          details: details
        });
      };

      var resetForm = function() {
        $scope.disableAddForm = false;
        $scope.newBinding.name = '';
        $scope.newBinding.namespace = projectName;
        $scope.newBinding.newRole = null;
      };

      var refreshServiceAccountsList = function(ctx) {
        DataService
          .list(serviceAccountVersion, ctx)
          .then(function(resp) {
            var serviceAccounts = _.keys(resp.by('metadata.name')).sort();
            angular.extend($scope, {
              serviceAccounts: serviceAccounts,
              refreshServiceAccounts: function(search) {
                if(search && !_.includes($scope.serviceAccounts, search)) {
                  $scope.serviceAccounts = [search].concat(serviceAccounts);
                } else {
                  $scope.serviceAccounts = serviceAccounts;
                }
              }
            });
          });
      };

      var refreshRoleBindingList = function(toUpdateOnError) {
        DataService
          .list($scope.roleBindingsVersion, requestContext, null , {
            errorNotification: false
          })
          .then(function(resp) {
            angular.extend($scope, {
              canShowRoles: true,
              roleBindings: resp.by('metadata.name'),
              subjectKindsForUI: MembershipService.mapRolebindingsForUI(resp.by('metadata.name'), allRoles)
            });
            resetForm();
          }, function() {
            // if the request errors but we have an object, we can at least update in place
            if(toUpdateOnError) {
              $scope.roleBindings[toUpdateOnError.metadata.name] = toUpdateOnError;
              $scope.subjectKindsForUI = MembershipService.mapRolebindingsForUI($scope.roleBindings, allRoles);
            }
            resetForm();
          });
      };

      var createBinding = function(role, newSubject) {
        $scope.disableAddForm = true;
        RoleBindingsService
          .create(role, newSubject, projectName, requestContext)
          .then(function() {
            refreshRoleBindingList();
            showToast('success', messages.update.subject.success({
              roleName: role.metadata.name,
              subjectName: newSubject.name
            }));
          }, function(err) {
            resetForm();
            refreshRoleBindingList();
            showToast('error', messages.update.subject.error({
              roleName: role.metadata.name,
              subjectName: newSubject.name
            }), $filter('getErrorDetails')(err));
          });
      };

      var updateBinding = function(rb, newSubject, projectName) {
        $scope.disableAddForm = true;
        RoleBindingsService
          .addSubject(rb, newSubject, projectName, requestContext)
          .then(function() {
            refreshRoleBindingList();
            showToast('success', messages.update.subject.success({
              roleName: rb.roleRef.name,
              subjectName: newSubject.name
            }));
          }, function(err) {
            resetForm();
            refreshRoleBindingList();
            showToast('error', messages.update.subject.error({
              roleName: rb.roleRef.name,
              subjectName: newSubject.name
            }), $filter('getErrorDetails')(err));
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
        forms: {},
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
          $scope.newBinding.name = '';
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
          // NOTE: hiding tooltip entirely for now, until descriptions merge:
          // https://github.com/openshift/origin/pull/11328
          // the tooltip will still work if roles are manually annotated
          var noInfoMessage = ''; // prev: 'There is no additional information about this role.';
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
          title: 'Confirm Removal',
          alerts: {},
          detailsMarkup: messages.remove.areYouSure.html.subject({
            roleName: roleName,
            kindName: humanizeKind(kind),
            subjectName:  subjectName
          }),
          okButtonText: 'Remove',
          okButtonClass: 'btn-danger',
          cancelButtonText: 'Cancel'
        };
        if(_.isEqual(subjectName, currentUserName)) {
          modalScope.detailsMarkup = messages.remove.areYouSure.html.self({
            roleName: roleName,
            subjectName: subjectName
          });
          if(MembershipService.isLastRole($scope.user.metadata.name, $scope.roleBindings)) {
            modalScope.alerts['currentUserLabelRole'] = {
              type: 'error',
              message: messages.notice.yourLastRole({roleName: roleName})
            };
          }
        }
        if(_.isEqual(kind, 'ServiceAccount') && _.startsWith(roleName, 'system:')) {
          modalScope.alerts['editingServiceAccountRole'] = {
            type: 'error',
            message: messages.warning.serviceAccount()
          };
        }
        return modalScope;
      };

      AuthService
        .withUser()
        .then(function(resp) {
          $scope.user = resp;
        });

      ProjectsService.list()
        .then(function(resp) {
          var projects = _.keys(resp.by('metadata.name')).sort();
          angular.extend($scope, {
            projects: projects,
            selectProject: function(projectName) {
              $scope.newBinding.name = '';
              refreshServiceAccountsList({
                namespace: projectName
              });
            },
            refreshProjects: function(search) {
              if(search && !_.includes($scope.projects, search)) {
                $scope.projects = [search].concat(projects);
              } else {
                $scope.projects = projects;
              }
            }
          });
        });

      ProjectsService
        .get($routeParams.project)
        .then(_.spread(function(project, context) {
          requestContext = context;
          refreshRoleBindingList();
          refreshServiceAccountsList(requestContext);

          angular.extend($scope, {
            project: project,
            subjectKinds: subjectKinds,
            canUpdateRolebindings: canI('rolebindings', 'update', projectName),
            confirmRemove: function(subjectName, kindName, roleName, namespace) {

              var redirectToProjectList = null;
              var modalScope = createModalScope(subjectName, kindName, roleName, $scope.user.metadata.name);
              if(_.isEqual(subjectName, $scope.user.metadata.name)) {
                if(MembershipService.isLastRole($scope.user.metadata.name, $scope.roleBindings)) {
                  redirectToProjectList = true;
                }
              }
              $uibModal.open({
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
                  .removeSubject(subjectName, roleName, namespace, $scope.roleBindings, requestContext)
                  .then(function(updateRolebinding) {
                    if(redirectToProjectList) {
                      $location.url("catalog");
                    } else {
                      AuthorizationService
                        .getProjectRules(projectName, true)
                        .then(function() {
                          refreshRoleBindingList(updateRolebinding[0]);
                          // test if the current user can still edit roles.
                          // if not, remove permissions & exit edit mode.
                          var canEdit = canI('rolebindings', 'update', projectName);
                          angular.extend($scope, {
                            canUpdateRolebindings: canEdit,
                            mode: {
                              edit: $scope.mode.edit ? canEdit : false
                            }
                          });
                        });
                      showToast('success', messages.remove.success({
                        roleName: roleName,
                        subjectName: subjectName
                      }));
                    }
                  }, function(err) {
                    showToast('error', messages.remove.error({
                      roleName: roleName,
                      subjectName: subjectName
                    }), $filter('getErrorDetails')(err));
                  });
              });
            },
            // subjectNamespace is only needed for service accounts, thus it is last and optional
            addRoleTo:function(subjectName, subjectKind, role, subjectNamespace) {
              var subject = {
                name: subjectName,
                kind: subjectKind
              };
              if(subjectKind === 'ServiceAccount') {
                subject.namespace = subjectNamespace;
              }
              // TODO (bpeterse): future. Role/ClusterRole roleRef disambiguation
              // Edge case a user creates a local Role with same name as ClusterRole,
              // roleRef doesn't necessarily contain namespace. There may be a way to
              // infer this, but isn't clear at the moment.  Will fast-follow PR if
              // a good solution is found.
              var rolebindingToUpdate = _.find($scope.roleBindings, {roleRef: {name: role.metadata.name}});
              if(rolebindingToUpdate && _.some(rolebindingToUpdate.subjects, subject)) {
                showToast('error', messages.update.subject.exists({
                  roleName: role.metadata.name,
                  subjectName: subjectName
                }));
              } else if(rolebindingToUpdate) {
                updateBinding(rolebindingToUpdate, subject, subjectNamespace);
              } else {
                createBinding(role, subject, subjectNamespace);
              }
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
              allRoles = MembershipService
                          .mapRolesForUI(
                            _.head(resp).by('metadata.name'),
                            _.last(resp).by('metadata.name'));
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
                toggleRoles: function() {
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
