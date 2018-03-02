'use strict';

/**
 * @ngdoc function
 * @name openshiftConsole.controller:PodController
 * @description
 * Controller of the openshiftConsole
 */
angular.module('openshiftConsole')
  .controller('PodController', function ($filter,
                                         $rootScope,
                                         $routeParams,
                                         $scope,
                                         $timeout,
                                         $uibModal,
                                         APIService,
                                         DataService,
                                         FullscreenService,
                                         ImageStreamResolver,
                                         Logger,
                                         MetricsService,
                                         OwnerReferencesService,
                                         PodsService,
                                         ProjectsService) {
    $scope.projectName = $routeParams.project;
    $scope.pod = null;
    $scope.imageStreams = {};
    $scope.imagesByDockerReference = {};
    $scope.imageStreamImageRefByDockerReference = {}; // lets us determine if a particular container's docker image reference belongs to an imageStream
    $scope.builds = {};
    $scope.alerts = {};
    $scope.terminalDisconnectAlert = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.logOptions = {};
    $scope.terminalTabWasSelected = false;
    $scope.breadcrumbs = [
      {
        title: "Pods",
        link: "project/" + $routeParams.project + "/browse/pods"
      },
      {
        title: $routeParams.pod
      }
    ];
    $scope.terminalDisconnectAlert["disconnect"] = {
      type: "warning",
      message: "This terminal has been disconnected. If you reconnect, your terminal history will be lost."
    };

    $scope.noContainersYet = true;

    // Must always be initialized so we can watch selectedTab
    $scope.selectedTab = {};

    var imageStreamsVersion = APIService.getPreferredVersion('imagestreams');
    var buildsVersion = APIService.getPreferredVersion('builds');
    $scope.podsVersion = APIService.getPreferredVersion('pods');
    $scope.podsLogVersion = APIService.getPreferredVersion('pods/log');
    $scope.eventsVersion = APIService.getPreferredVersion('events');
    $scope.deploymentConfigsVersion = APIService.getPreferredVersion('deploymentconfigs');

    var watches = [];
    // Listen for nav toggles so we can resize the terminal window.
    var toggleNavListener = null;
    var requestContext = null;

    // Check if the metrics service is available so we know when to show the tab.
    MetricsService.isAvailable().then(function(available) {
      $scope.metricsAvailable = available;
    });

    var setContainerVars = function() {
      if(!$scope.pod) {
        return;
      }
      var containerStatus = _.find($scope.pod.status.containerStatuses, { name: $scope.logOptions.container });
      var state = _.get(containerStatus, 'state');
      var statusKey = _.head(_.keys(state));
      var knownKey = _.includes(['running', 'waiting', 'terminated'], statusKey) ? statusKey : '';
      var lastState = _.get(containerStatus, 'lastState');
      var lastStatusKey = _.head(_.keys(lastState));
      var isWaiting =  _.get(containerStatus, 'state.waiting');

      angular.extend($scope, {
        containerStatusKey: knownKey,
        containerStateReason: _.get(state, [statusKey, 'reason'])
      });

      if(isWaiting) {
        angular.extend($scope, {
          lasStatusKey: lastStatusKey,
          containerStartTime:  _.get(lastState, [lastStatusKey, 'startedAt']),
          containerEndTime:  _.get(lastState, [lastStatusKey, 'finishedAt'])
        });
      } else {
        angular.extend($scope, {
          containerStartTime: _.get(state, [statusKey, 'startedAt']),
          containerEndTime: _.get(state, [statusKey, 'finishedAt'])
        });
      }
    };

    var calculateCharacterBoundingBox = function() {
      var calcSpan = $("<span>")
      .css({
        position: "absolute",
        top: "-100px"
      })
      .addClass("terminal-font")
      .text(_.repeat('x', 10))
      .appendTo('body');
      var vals = {
        width: calcSpan.width() / 10, // average across several characters to take into account internal spacing
        height: calcSpan.height()
      };
      calcSpan.remove();
      return vals;
    };

    var characterBoundingBox = calculateCharacterBoundingBox();
    var win = $( window );
    var calculateTerminalSize = function(retries){
      if (!retries) {
        retries = 0;
      }

      if (!characterBoundingBox.height || !characterBoundingBox.width || !$scope.selectedTab.terminal || retries > 10) {
        return;
      }
      $scope.$evalAsync(function() {
        var terminalWrapper = $('.container-terminal-wrapper').get(0);
        // `terminalWrapper` may not exist yet, we should retry
        if (!terminalWrapper) {
          $timeout(function(){
            calculateTerminalSize(retries + 1);
          }, 50);
          return;
        }

        var r = terminalWrapper.getBoundingClientRect();
        // Check if the content under the terminal tab isnt fully appended to the DOM yet, in that case
        // there is no bounding box yet so we can't calculate the right width / height. Retry.
        if (r.left === 0 && r.top === 0 && r.width === 0 && r.height === 0) {
          $timeout(function(){
            calculateTerminalSize(retries + 1);
          }, 50);
          return;
        }
        var windowHeight = win.height();
        var termWidth = r.width - 17; // 17px is roughly the width of an average scrollbar
        var termHeight = windowHeight - r.top - 36;
        $scope.terminalCols = Math.max(_.floor(termWidth / characterBoundingBox.width), 80);
        $scope.terminalRows = Math.max(_.floor(termHeight / characterBoundingBox.height), 24);
      });
    };

    var addTerminalResizeListeners = function() {
      $(window).on('resize.terminalsize', _.debounce(calculateTerminalSize, 100));
      if (!toggleNavListener) {
        toggleNavListener = $rootScope.$on('oscHeader.toggleNav', function() {
          // Wait for the Patternfly animation to complete. Transition is
          // 100ms, but add some buffer to be safe.
          setTimeout(calculateTerminalSize, 150);
        });
      }
    };

    var removeTerminalResizeListeners = function() {
      $(window).off('resize.terminalsize');
      if (toggleNavListener) {
        toggleNavListener();
        toggleNavListener = null;
      }
    };

    $scope.$watch('selectedTab.terminal', function(terminalTabSelected) {
      if (terminalTabSelected) {
        if (!characterBoundingBox.height || !characterBoundingBox.width) {
          Logger.warn("Unable to calculate the bounding box for a character.  Terminal will not be able to resize.");
        } else {
          addTerminalResizeListeners();
        }
        $timeout(calculateTerminalSize, 0);
      } else {
        removeTerminalResizeListeners();
      }
    });

    /**
     *  Will set the newTerm's isVisible/isUsed to true, while hiding the previous
     */
    $scope.onTerminalSelectChange = function(newTerm) {
      // Make all terminals invisible (Because we don't have a pointer to the terminal that is currently visible)
      _.each($scope.containerTerminals, function(term) {
        term.isVisible = false;
      });

      newTerm.isVisible = true;
      newTerm.isUsed = true;
      $scope.selectedTerminalContainer = newTerm;
    };

    var getState = function(containerStatus) {
      var state = _.get(containerStatus, 'state', {});
      return _.head(_.keys(state));
    };

    var makeTerminals = function() {
      var terminals = [];

      _.each($scope.pod.spec.containers, function(container) {
        var thisContainerStatus = _.find($scope.pod.status.containerStatuses, { name: container.name });
        var thisContainerState = getState(thisContainerStatus);

        terminals.push({
          containerName: container.name,
          isVisible: false,
          isUsed: false,
          containerState: thisContainerState
        });
      });

      var currentlyVisible = _.head(terminals);
      currentlyVisible.isVisible = true;
      currentlyVisible.isUsed = true;

      $scope.selectedTerminalContainer = currentlyVisible;

      return terminals;
    };

    var updateContainersYet = function(pod) {
      if ($scope.noContainersYet) {
        $scope.noContainersYet = $scope.containersRunning(pod.status.containerStatuses) === 0;
      }
    };

    var updateTerminals = function(terminals) {
      _.each(terminals, function(term) {
        var thisContainerStatus = _.find($scope.pod.status.containerStatuses, { name: term.containerName });
        var thisContainerState = getState(thisContainerStatus);

        term.containerState = thisContainerState;
      });
    };

    var annotation = $filter('annotation');
    var podResolved = function(pod, action) {
      $scope.loaded = true;
      $scope.pod = pod;
      $scope.dcName = annotation(pod, 'deploymentConfig');
      $scope.rcName = annotation(pod, 'deployment');
      $scope.deploymentVersion = annotation(pod, 'deploymentVersion');
      $scope.logCanRun = !(_.includes(['New', 'Pending', 'Unknown'], pod.status.phase));
      setContainerVars();

      // Show owner ref if owned by a replication controller, replica set, or build.
      // Deployment configs are handled specially in the view.
      delete $scope.controllerRef;
      if (!$scope.dcName) {
        var controllerReferences = OwnerReferencesService.getControllerReferences(pod);
        $scope.controllerRef = _.find(controllerReferences, function(ref) {
          return ref.kind === 'ReplicationController' ||
                 ref.kind === 'ReplicaSet' ||
                 ref.kind === 'Build';
        });
      }

      if (action === "DELETED") {
        $scope.alerts["deleted"] = {
          type: "warning",
          message: "This pod has been deleted."
        };
      }
    };

    ProjectsService
      .get($routeParams.project)
      .then(_.spread(function(project, context) {
        requestContext = context;
        $scope.project = project;
        // FIXME: DataService.createStream() requires a scope with a
        // projectPromise rather than just a namespace, so we have to pass the
        // context into the log-viewer directive.
        $scope.projectContext = context;
        DataService
          .get($scope.podsVersion, $routeParams.pod, context, { errorNotification: false })
          .then(function(pod) {
            podResolved(pod);
            var pods = {};
            pods[pod.metadata.name] = pod;
            $scope.logOptions.container = $routeParams.container || pod.spec.containers[0].name;
            $scope.containerTerminals = makeTerminals();
            updateContainersYet(pod);
            ImageStreamResolver.fetchReferencedImageStreamImages(pods, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, requestContext);
            watches.push(DataService.watchObject($scope.podsVersion, $routeParams.pod, context, function(pod, action) {
              podResolved(pod, action);
              updateTerminals($scope.containerTerminals);
              updateContainersYet(pod);
            }));
          }, function(e) {
            $scope.loaded = true;
            $scope.alerts["load"] = {
              type: "error",
              message: "The pod details could not be loaded.",
              details: $filter('getErrorDetails')(e)
            };
          });

        // covers container picker if multiple containers
        // outside of the above watch to avoid repeatedly generating new watches.
        $scope.$watch('logOptions.container', setContainerVars);

        // Sets up subscription for imageStreams
        watches.push(DataService.watch(imageStreamsVersion, context, function(imageStreams) {
          $scope.imageStreams = imageStreams.by("metadata.name");
          ImageStreamResolver.buildDockerRefMapForImageStreams($scope.imageStreams, $scope.imageStreamImageRefByDockerReference);
          ImageStreamResolver.fetchReferencedImageStreamImages($scope.pods, $scope.imagesByDockerReference, $scope.imageStreamImageRefByDockerReference, context);
          Logger.log("imagestreams (subscribe)", $scope.imageStreams);
        }));

        watches.push(DataService.watch(buildsVersion, context, function(builds) {
          $scope.builds = builds.by("metadata.name");
          Logger.log("builds (subscribe)", $scope.builds);
        }));

        var debugPodWatch;

        // Delete the debug pod and any watches if they exist.
        var cleanUpDebugPod = function() {
          var debugPod = $scope.debugPod;

          if (debugPodWatch) {
            DataService.unwatch(debugPodWatch);
            debugPodWatch = null;
          }

          $(window).off('beforeunload.debugPod');

          if (debugPod) {
            DataService.delete($scope.podsVersion, debugPod.metadata.name, context, {
              gracePeriodSeconds: 0
            }).then(
              // success
              _.noop,
              // failure
              function(result) {
                $scope.alerts['debug-container-error'] = {
                  type: "error",
                  message: "Could not delete pod " + debugPod.metadata.name,
                  details: $filter('getErrorDetails')(result)
                };
              });
            $scope.debugPod = null;
          }
        };

        var focusTerminal = function() {
          $('.terminal:visible').focus();
        };

        $scope.hasFullscreen = FullscreenService.hasFullscreen(true);
        $scope.fullscreenTerminal = function() {
          FullscreenService.requestFullscreen('#container-terminal-wrapper');
          // Give focus back to the terminal after the user clicks the link.
          setTimeout(focusTerminal);
        };

        $scope.exitFullscreen = function() {
          FullscreenService.exitFullscreen();
        };

        $scope.debugTerminal = function(containerName) {
          var debugPod = PodsService.generateDebugPod($scope.pod, containerName);
          if (!debugPod) {
            $scope.alerts['debug-container-error'] = {
              type: "error",
              message: "Could not debug container " + containerName
            };
            return;
          }

          DataService.create(APIService.objectToResourceGroupVersion(debugPod), null, debugPod, context).then(
            function(pod) {
              var container = _.find($scope.pod.spec.containers, { name: containerName });
              $scope.debugPod = pod;

              // Warn users when navigating away with the debug pod open. (Removed in `cleanUpDebugPod`.)
              $(window).on('beforeunload.debugPod', function() {
                return "Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.";
              });

              // Watch the pod so we know when it's running to connect.
              // Keep the watch handle in a var outside the watches array so we
              // can unwatch immediately when the terminal is closed.
              debugPodWatch = DataService.watchObject($scope.podsVersion,
                                                      debugPod.metadata.name,
                                                      context,
                                                      function(pod) {
                $scope.debugPod = pod;
              });

              // Show the terminal in a modal window.
              var modalInstance = $uibModal.open({
                templateUrl: 'views/modals/debug-terminal.html',
                controller: 'DebugTerminalModalController',
                scope: $scope,
                resolve: {
                  container: function() {
                    return container;
                  },
                  image: function() {
                    return _.get($scope, ['imagesByDockerReference', container.image]);
                  }
                },
              });

              // On modal close, delete the pod.
              modalInstance.result.then(cleanUpDebugPod);
            },
            //failure
            function(result) {
              $scope.alerts['debug-container-error'] = {
                type: "error",
                message: "Could not debug container " + containerName,
                details: $filter('getErrorDetails')(result)
              };
            });
        };

        $scope.containersRunning = function(containerStatuses) {
          var running = 0;
          if (containerStatuses) {
            containerStatuses.forEach(function(v) {
              if (v.state && v.state.running) {
                running++;
              }
            });
          }
          return running;
        };

        $scope.$on('$destroy', function(){
          DataService.unwatchAll(watches);
          cleanUpDebugPod();
          removeTerminalResizeListeners();
        });
    }));
  });
