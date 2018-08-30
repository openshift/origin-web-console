'use strict';
/*jshint -W030 */

angular.module('openshiftConsole')
  .directive('logViewer', [
    '$sce',
    '$timeout',
    '$window',
    '$filter',
    '$q',
    'AggregatedLoggingService',
    'APIService',
    'APIDiscovery',
    'AuthService',
    'DataService',
    'HTMLService',
    'ModalsService',
    'logLinks',
    'BREAKPOINTS',
    function($sce,
             $timeout,
             $window,
             $filter,
             $q,
             AggregatedLoggingService,
             APIService,
             APIDiscovery,
             AuthService,
             DataService,
             HTMLService,
             ModalsService,
             logLinks) {
      // cache the jQuery win, but not clobber angular's $window
      var $win = $(window);

      // Keep a reference the DOM node rather than the jQuery object for cloneNode.
      var logLineTemplate =
        $('<tr class="log-line">' +
          '<td class="log-line-number"></td>' +
          '<td class="log-line-text"></td>' +
          '</tr>').get(0);
      var buildLogLineNode = function(lineNumber, text) {
        var line = logLineTemplate.cloneNode(true);
        // Set the line number as a data attribute and display it using the
        // ::before pseudo-element in CSS so it isn't copied. Works around
        // this webkit bug with user-select: none;
        //   https://bugs.webkit.org/show_bug.cgi?id=80159
        line.firstChild.setAttribute('data-line-number', lineNumber);

        // Escape ANSI color codes
        var escaped = ansi_up.escape_for_html(text);
        var html = ansi_up.ansi_to_html(escaped);
        var linkifiedHTML = HTMLService.linkify(html, '_blank', true);
        line.lastChild.innerHTML = linkifiedHTML;

        return line;
      };


      return {
        restrict: 'AE',
        transclude: true,
        templateUrl: 'views/directives/logs/_log-viewer.html',
        scope: {
          followAffixTop: '=?',
          object: '=',
          fullLogUrl: '=?',
          name: '=',
          context: '=',
          options: '=?',
          fixedHeight: '=?',
          chromeless: '=?',
          empty: '=?',        // boolean, let the parent know when the log is empty
          run: '=?'           // boolean, logs will not run until this is truthy
        },
        controller: [
          '$scope',
          function($scope) {
            // cached node's are set by the directive's postLink fn after render (see link: func below)
            // A jQuery wrapped version is cached in var of same name w/$
            var cachedLogNode;
            var scrollableNode;
            var $affixableNode;
            var html = document.documentElement;
            $scope.logViewerID = _.uniqueId('log-viewer');
            $scope.empty = true;

            var logSubresource, name;
            if ($scope.object.kind === "ReplicationController") {
              logSubresource = "deploymentconfigs/log";
              name = $filter('annotation')($scope.object, 'deploymentConfig');
            }
            else {
              logSubresource = APIService.kindToResource($scope.object.kind) + "/log";
              name = $scope.object.metadata.name;
            }


            // is just toggling show/hide, nothing else.
            var updateScrollLinksVisibility = function() {
              $scope.$apply(function() {
                // Show scroll links if the top or bottom of the log is off screen.
                var r = cachedLogNode.getBoundingClientRect();
                if ($scope.fixedHeight) {
                  $scope.showScrollLinks = r && (r.height > $scope.fixedHeight);
                }
                else {
                  $scope.showScrollLinks = r && ((r.top < 0) || (r.bottom > html.clientHeight));
                }
              });
            };



            // Set to true before auto-scrolling.
            var autoScrollingNow = false;
            var onScroll = function() {

              // Determine if the user scrolled or we auto-scrolled.
              if (autoScrollingNow) {
                // Reset the value.
                autoScrollingNow = false;
              } else {
                // If the user scrolled the window manually, stop auto-scrolling.
                $scope.$evalAsync(function() {
                  $scope.autoScrollActive = false;
                });
              }
            };


            var attachScrollEvents = function() {
              if(scrollableNode) {
                $(scrollableNode).on('scroll', onScroll);
              } else {
                $win.on('scroll', onScroll);
              }
            };

            var affix = function() {
              // don't affix for a fixed height scroll window
              if ($scope.fixedHeight) {
                return;
              }
              $affixableNode
                .affix({
                  target:  window,
                  offset: {
                    top:  $scope.followAffixTop || 0 // 390
                  }
                });
            };

            var getLogOutputElement = function() {
              return $('#' + $scope.logViewerID + ' .log-view-output');
            };

            var fillHeight = function(animate) {
              var content = getLogOutputElement();
              var contentTop = content.offset().top;
              if (contentTop < 0) {
                // Content top is off the page already.
                return;
              }

              var pulserHeight = $('.ellipsis-pulser').outerHeight(true);
              var fill = $scope.fixedHeight ? $scope.fixedHeight : Math.floor($(window).height() - contentTop - pulserHeight);
              if (!$scope.chromeless && !$scope.fixedHeight) {
                // Add some bottom margin if not chromeless.
                // 40px, same as `@middle-content-bottom-margin`
                fill = fill - 40;
              }
              if (animate) {
                content.animate({ 'min-height': fill +'px' }, 'fast');
              } else {
                content.css('min-height', fill + 'px');
              }

              if($scope.fixedHeight) {
                content.css('max-height', fill);
              }
            };

            var visibleInterval;
            var resizeWhenVisible = function() {
              if (visibleInterval) {
                return;
              }

              var done = function() {
                clearInterval(visibleInterval);
                visibleInterval = null;
                // To avoid flicker, the log doesn't display until sized === true
                $scope.$evalAsync(function() {
                  $scope.sized = true;
                });
              };

              var retries = 0;
              visibleInterval = setInterval(function() {
                if (retries > 10) {
                  done();
                  return;
                }

                retries++;
                var content = getLogOutputElement();
                if (content.is(':visible')) {
                  fillHeight();
                  done();
                }
              }, 100);
            };

            // roll up & debounce the various fns to call on resize
            var onResize = _.debounce(function() {
              fillHeight(true);
              updateScrollLinksVisibility();  // toggles show/hide
              // toggle off the follow behavior if the user resizes the window
              onScroll();
            }, 100);

            $win.on('resize', onResize);



            // STREAMER & DOM NODE HANDLING ------------------------------------


            var autoScrollBottom = function() {
              // Tell the scroll listener this is an auto-scroll. The listener
              // will reset it to false.
              autoScrollingNow = true;
              logLinks.scrollBottom(scrollableNode);
            };


            var toggleAutoScroll = function() {
              $scope.autoScrollActive = !$scope.autoScrollActive;
              if ($scope.autoScrollActive) {
                // Scroll immediately. Don't wait the next message.
                autoScrollBottom();
              }
            };

            var buffer = document.createDocumentFragment();

            var update = _.debounce(function() {
              cachedLogNode.appendChild(buffer);
              buffer = document.createDocumentFragment();

              // Follow the bottom of the log if auto-scroll is on.
              if ($scope.autoScrollActive) {
                autoScrollBottom();
              }

              if (!$scope.showScrollLinks) {
                updateScrollLinksVisibility(); // toggles show/hide
              }
            }, 100, { maxWait: 300 });


            // maintaining one streamer reference & ensuring its closed before we open a new,
            // since the user can (potentially) swap between multiple containers
            var streamer;
            var stopStreaming = function(keepContent) {
              var deferred = $q.defer();
              if (streamer) {
                streamer.onClose(function() {
                  deferred.resolve();
                });
                streamer.stop();
              } else {
                // Resolve immediately if no active stream.
                deferred.resolve();
              }

              if (!keepContent) {
                // Cancel any pending updates. (No-op if none pending.)
                update.cancel();
                cachedLogNode && (cachedLogNode.innerHTML = '');
                buffer = document.createDocumentFragment();
              }

              return deferred.promise;
            };

            var streamLogs = function() {
              // Stop any active streamer.
              stopStreaming().then(function() {
                $scope.$evalAsync(function() {
                  if(!$scope.run) {
                    return;
                  }

                  angular.extend($scope, {
                    loading: true,
                    autoScrollActive: true,
                    largeLog: false,
                    limitReached: false,
                    showScrollLinks: false,
                    state: ''
                  });

                  var options = angular.extend({
                    follow: true,
                    tailLines: 5000,
                    // Limit log size to 10 MiB. Note: This can't be more than 500 MiB,
                    // otherwise save log will break because we'll exceed the max Blob
                    // size for some browsers.
                    // https://github.com/eligrey/FileSaver.js#supported-browsers
                    limitBytes: 10 * 1024 * 1024
                  }, $scope.options);

                  streamer = DataService.createStream(logSubresource, name, $scope.context, options);

                  var lastLineNumber = 0;
                  var lastIncompleteToken = '';

                  // Returns true if string is newline terminated, false otherwise
                  var isCompleteLine = function(string) {
                    return /\n$/.test(string);
                  };

                  // Tokenizes text into newline terminated tokens, includes final
                  // non-newline terminated token if it exists. This will return
                  // an extra empty string when 'text' is newline terminated.
                  var tokenize = function(text) {
                    return text.match(/^.*(\n|$)/gm);
                  };

                  // Concatenates the token with the previous incomplete token,
                  // then appends it to the buffer if it is newline terminated,
                  // or updates the last incomplete token accordingly.
                  var handleToken = function(token) {
                    var next = lastIncompleteToken + token;
                    if(isCompleteLine(token)) {
                      lastIncompleteToken = '';
                      lastLineNumber++;
                      // Append the line to the document fragment buffer.
                      buffer.appendChild(buildLogLineNode(lastLineNumber, next));
                      update();
                    } else {
                      lastIncompleteToken = next;
                    }
                  };

                  // Break WebSocket message into tokens, then pass on to token handler.
                  var ingest = function(text) {
                    var tokens = tokenize(text);
                    _.each(tokens, handleToken);
                  };

                  streamer.onMessage(function(msg, raw, cumulativeBytes) {
                    // ensures the digest loop will catch the state change.
                    $scope.$evalAsync(function() {
                      $scope.empty = false;
                      if($scope.state !== 'logs') {
                        $scope.state = 'logs';
                        resizeWhenVisible();
                      }
                    });

                    // Completely empty messages (without even a newline character) should not add lines
                    if (!msg) {
                      return;
                    }

                    if (options.limitBytes && cumulativeBytes >= options.limitBytes) {
                      $scope.$evalAsync(function() {
                        $scope.limitReached = true;
                        $scope.loading = false;
                      });
                      stopStreaming(true);
                    }

                    ingest(msg);

                    // Warn the user if we might be showing a partial log.
                    if (!$scope.largeLog && lastLineNumber >= options.tailLines) {
                      $scope.$evalAsync(function() {
                        $scope.largeLog = true;
                      });
                    }
                  });

                  streamer.onClose(function() {
                    streamer = null;
                    $scope.$evalAsync(function() {
                      $scope.loading = false;
                      $scope.autoScrollActive = false;
                      // - if no logs, they have already been archived.
                      // - if emptyStateMessage has already been set, it means the onError
                      //   callback has already fired.  onError message takes priority in severity.
                      // - at present we are using the same error message in both onError and onClose
                      //   because we dont have enough information to give the user something better.
                      if((lastLineNumber === 0) && (!$scope.emptyStateMessage)) {
                        $scope.state = 'empty';
                        $scope.emptyStateMessage = 'The logs are no longer available or could not be loaded.';
                      }
                    });
                  });

                  streamer.onError(function() {
                    streamer = null;
                    $scope.$evalAsync(function() {
                      angular.extend($scope, {
                        loading: false,
                        autoScrollActive: false
                      });
                      // if logs err before we get anything, will show an empty state message
                      if(lastLineNumber === 0) {
                        $scope.state = 'empty';
                        $scope.emptyStateMessage = 'The logs are no longer available or could not be loaded.';
                      } else {
                        // if logs were running but something went wrong, will
                        // show what we have & give option to retry
                        $scope.errorWhileRunning = true;
                      }
                    });
                  });

                  streamer.start();
                });
              });
            };

            // Kibana archives -------------------------------------------------

            APIDiscovery
              .getLoggingURL($scope.context.project)
              .then(function(url) {
                var projectName = _.get($scope.context, 'project.metadata.name');
                var containerName = _.get($scope.options, 'container');

                if(!(projectName && containerName && name && url)) {
                  return;
                }

                AggregatedLoggingService.isOperationsUser().then(function(canViewOperationsLogs) {
                  $scope.$watchGroup(['context.project.metadata.name', 'options.container', 'name'], function() {
                    angular.extend($scope, {
                      kibanaArchiveUrl: logLinks.archiveUri({
                        baseURL: url,
                        namespace: $scope.context.project.metadata.name,
                        namespaceUid: $scope.context.project.metadata.uid,
                        podname: name,
                        containername: $scope.options.container,
                        backlink: URI.encode($window.location.href)
                      }, $filter('annotation')($scope.context.project,'loggingDataPrefix'), canViewOperationsLogs)
                    });
                  });
                });
              });

            // PUBLIC API ----------------------------------------------------

            this.cacheScrollableNode = function(node) {
              scrollableNode = node;
            };

            this.cacheLogNode = function(node) {
              cachedLogNode = node; // no jQuery, optimized
            };

            this.cacheAffixable = function(node) {
              $affixableNode = $(node); // jQuery is fine
            };

            this.start = function() {
              attachScrollEvents();
              affix();
            };

            // initial $scope setup --------------------------------------------

            angular.extend($scope, {
              ready: true,
              loading: true,
              autoScrollActive: true,
              state: false, // show nothing initially to avoid flicker
              onScrollBottom: function() {
                logLinks.scrollBottom(scrollableNode);
              },
              onScrollTop: function() {
                $scope.autoScrollActive = false;
                logLinks.scrollTop(scrollableNode);
                $('#' + $scope.logViewerID + '-affixedFollow').affix('checkPosition');
              },
              toggleAutoScroll: toggleAutoScroll,
              goChromeless: logLinks.chromelessLink,
              restartLogs: streamLogs
            });


            // tear down -------------------------------------------------------

            $scope.$on('$destroy', function() {
              // close streamer or no-op
              stopStreaming();
              // clean up all the listeners
              $win.off('resize', onResize);
              $win.off('scroll', onScroll);
              if (scrollableNode) {
                $(scrollableNode).off('scroll', onScroll);
              }
            });


            // decide whether we should request the logs ------------------------
            if (logSubresource === 'deploymentconfigs/logs' && !name) {
              $scope.state = 'empty';
              $scope.emptyStateMessage = 'Logs are not available for this replication controller because it was not generated from a deployment configuration.';
              // don't even attempt to continue since we can't fetch the logs for these RCs
              return;
            }

            $scope.$watchGroup(['name', 'options.container', 'run'], streamLogs);
          }
        ],
        require: 'logViewer',
        link: function($scope, $elem, $attrs, ctrl) {
          // TODO:
          // unfortuntely this directive has to search for a parent elem to use as scrollable :(
          // would be better if 'scrollable' was a directive on a parent div
          // and we were sending it messages telling it when to scroll.
          $timeout(function() {
            if ($scope.fixedHeight) {
              ctrl.cacheScrollableNode(document.getElementById($scope.logViewerID + '-fixed-scrollable'));
            }
            ctrl.cacheLogNode(document.getElementById($scope.logViewerID+'-logContent'));
            ctrl.cacheAffixable(document.getElementById($scope.logViewerID+'-affixedFollow'));
            ctrl.start();
          }, 0);

          var saveLog = function() {
            var text = $($elem).find('.log-line-text').text();
            var filename = _.get($scope, 'object.metadata.name', 'openshift') + '.log';
            var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            saveAs(blob, filename);
          };

          // Detect if we can save files.
          // https://github.com/eligrey/FileSaver.js#supported-browsers
          $scope.canSave = !!new Blob();

          $scope.saveLog = function() {
            // Save without confirmation if we're showing the complete log.
            if (!$scope.largeLog) {
              saveLog();
              return;
            }

            // Prompt if this is a partial log.
            ModalsService.confirmSaveLog($scope.object).then(saveLog);
          };
        }
      };
    }
  ]);
