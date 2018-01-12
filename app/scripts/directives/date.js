'use strict';

angular.module('openshiftConsole')
  .directive("timeOnlyDurationUntilNow", function() {
    return {
      restrict: 'E',
      scope: {
        timestamp: '=',
        omitSingle: '=?',
        precision: '=?'
      },
      template: '<span data-timestamp="{{timestamp}}" data-time-only="true" class="duration">{{timestamp | timeOnlyDurationFromTimestamps : null}}</span>'
    };
  })  
  .directive("durationUntilNow", function() {
    return {
      restrict: 'E',
      scope: {
        timestamp: '=',
        omitSingle: '=?',
        precision: '=?'
      },
      template: '<span data-timestamp="{{timestamp}}" data-omit-single="{{omitSingle}}" data-precision="{{precision}}" class="duration">{{timestamp | duration : null : omitSingle : precision}}</span>'
    };
  })
  .directive("timeRemainingFromNow", function() {
    return {
      restrict: 'E',
      scope: {
        endTimestamp: '='
      },
      template: '<span data-timestamp="{{endTimestamp}}" class="countdown">{{endTimestamp | countdownToTimestamp}}</span>'
    };
  })  ;
