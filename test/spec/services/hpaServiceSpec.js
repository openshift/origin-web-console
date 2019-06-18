'use strict';

describe('HPAService', function() {
  var HPAService;
  var $q;
  var $rootScope;
  var $window;

  var metricsAreAvailable;

  beforeEach(module('openshiftConsole', function($provide) {
    metricsAreAvailable = true;
    // MetricsService needs to be pass-through
    var metricsServiceMock = {
      isAvailable: function() {
        return $q.when(metricsAreAvailable);
      }
    };
    $provide.factory('MetricsService', function() {
      return metricsServiceMock;
    });
  }));


  beforeEach(inject(function(_$q_, _$rootScope_, _$window_, _HPAService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    HPAService = _HPAService_;
  }));

  // Default fixtures.
  // These are put together in such a way that they should not trigger any
  // of the HPAService.getHPAWarnings().  Each test below should swap out the
  // resource(s) fixture that will trigger the specific warning to test.
  var defaultScaleTarget = {
    kind: '',
    spec: {
      template: {
        spec: {
          containers: [
            {
              name: 'bob',
              image: '',
              env: [],
              resources: {
                requests: {
                  memory: '32Mi',
                  cpu: '250m'
                },
                limits: {
                  memory: '64Mi',
                  cpu: '250m'
                }
              }
            }
          ]
        }
      }
    }
  };
  var defaultHpaResources = [{}];
  var defaultLimitRanges = [{
    spec: {
      limits: [{
        type: '',
        min: '',
        max: '',
        default: ''
      }]
    }
  }];
  var defaultProject = {
    metadata: {
      name: ''
    }
  };



  describe('#addCPURequestWarning', function() {


    describe('When there are no HPA resources', function() {
      it('should return an empty set of messages (no errors)', function() {
        var noHPA = [];
        HPAService
          .getHPAWarnings(defaultScaleTarget, noHPA, defaultLimitRanges, defaultProject)
          .then(function(warnings) {
            expect(_.size(warnings)).toEqual(0);
          });
        $rootScope.$digest();
      });
    });

    describe('When the scale target does not have a CPU request set', function() {
      var scaleTargetWithoutLimit = {
        kind: '',
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: 'bob',
                  image: '',
                  env: [],
                }
              ]
            }
          }
        }
      };

      describe('if a v2beta1 HPA is used', function() {
        it('should return neither a warning with reason V2Beta1HPA or NoCPURequest', function() {
          // this is a v2beta1 hpa represented as a v1 object
          var hpaWithV2Beta1 = [{
            metadata: {
              annotations: {
                'autoscaling.alpha.kubernetes.io/metrics': '[{ "type": "Pods" }]'
              }
            },
            spec: {
              scaleTargetRef: {
                kind: 'ReplicationController'
              }
            }
          }];
          HPAService
            .getHPAWarnings(scaleTargetWithoutLimit, hpaWithV2Beta1, defaultLimitRanges, defaultProject)
            .then(function(warnings) {
              expect(warnings.length).toEqual(0);
            });
          $rootScope.$digest();
        });
      });

      describe('if a v1 HPA is used', function() {
        it('should return a warning with reason NoCPURequest', function() {
          // NOTE: if the scale target has no containers, then the
          // hasRequestOrLimit function in HPAService will return true.
          // This could be a potential bug, though I imagine we never
          // pass it an object w/o containers.
          HPAService
            .getHPAWarnings(scaleTargetWithoutLimit, defaultHpaResources, defaultLimitRanges, defaultProject)
            .then(function(warnings) {
              expect(_.head(warnings).reason).toEqual('NoCPURequest');
            });
          $rootScope.$digest();
        });
      });
    });

    describe('Warn when there are competing autoscalers', function() {
      it('should return a warning with reason DeploymentHasHPA', function() {
        var hpaResources = [{}, {}];
        HPAService
          .getHPAWarnings(defaultScaleTarget, hpaResources, defaultLimitRanges, defaultProject)
          .then(function(warnings) {
            expect(_.head(warnings).reason).toEqual('MultipleHPA');
          });
        $rootScope.$digest();
      });
    });

    describe('When the target is scaled by both a DC and an autoscaler', function() {
      it('should return a warning with reason DeploymentHasHPA', function() {
        var scaleTarget = {
          kind: 'ReplicationController',
          metadata: {
            annotations: {
              'openshift.io/deployment-config.name': 'foobar'
            }
          }
        };
        var hpaResources = [{
          spec: {
            scaleTargetRef: {
              kind: 'ReplicationController'
            }
          }
        }];

        HPAService
          .getHPAWarnings(scaleTarget, hpaResources, defaultLimitRanges, defaultProject)
          .then(function(warnings) {
            expect(_.head(warnings).reason).toEqual('DeploymentHasHPA');
          });
        $rootScope.$digest();
      });
    });

  });
});
