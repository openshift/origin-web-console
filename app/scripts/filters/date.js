'use strict';

angular.module('openshiftConsole')
  .filter('duration', function() {
    return function(timestampLhs, timestampRhs, omitSingle, precision) {
      if (!timestampLhs) {
        return timestampLhs;
      }
      precision = precision || 2;
      timestampRhs = timestampRhs || new Date(); // moment expects either an ISO format string or a Date object

      var ms = moment(timestampRhs).diff(timestampLhs);
      if (ms < 0) {
        // Don't show negative durations
        ms = 0;
      }
      var duration = moment.duration(ms);
      // the out of the box humanize in moment.js rounds to the nearest time unit
      // but we need more details
      var humanizedDuration = [];
      var years = duration.years();
      var months = duration.months();
      var days = duration.days();
      var hours = duration.hours();
      var minutes = duration.minutes();
      var seconds = duration.seconds();

      function add(count, singularText, pluralText) {
        if (count === 0) {
          return;
        }

        if (count === 1) {
          if (omitSingle) {
            humanizedDuration.push(singularText);
          } else {
            humanizedDuration.push("1 " + singularText);
          }

          return;
        }

        humanizedDuration.push(count + ' ' + pluralText);
      }

      add(years, "year", "years");
      add(months, "month", "months");
      add(days, "day", "days");
      add(hours, "hour", "hours");
      add(minutes, "minute", "minutes");
      add(seconds, "second", "seconds");

      // If precision is 1, we're showing rough values. Don't show values less
      // than a minute.
      // TODO: Is there ever a time we want precision = 1 and to show seconds?
      if (humanizedDuration.length === 1 && seconds && precision === 1) {
        if (omitSingle) {
          return "minute";
        }

        return "1 minute";
      }

      if (humanizedDuration.length === 0) {
        humanizedDuration.push("0 seconds");
      }

      if (humanizedDuration.length > precision) {
        humanizedDuration.length = precision;
      }

      return humanizedDuration.join(", ");
    };
  })
  .filter('ageLessThan', function() {
    // ex:  amt = 5  and unit = 'minutes'
    return function(timestamp, amt, unit) {
      return moment().subtract(amt, unit).diff(moment(timestamp)) < 0;
    };
  })
  // Humanize duration values like 300 "seconds" as opposed to timestamps (see duration filter above).
  // http://momentjs.com/docs/#/durations/
  .filter('humanizeDurationValue', function() {
    return function(duration, unit) {
      return moment.duration(duration, unit).humanize();
    };
  })
  .filter('timeOnlyDurationFromTimestamps', function(timeOnlyDurationFilter) {
    return function(timestampLhs, timestampRhs) {
      if (!timestampLhs) {
        return timestampLhs;
      }
      timestampRhs = timestampRhs || new Date(); // moment expects either an ISO format string or a Date object

      return timeOnlyDurationFilter(moment(timestampRhs).diff(timestampLhs));
    };
  })
  .filter('countdownToTimestamp', function() {
    return function(endTimestamp) {
      var timeRemaining = moment(new Date(endTimestamp)).diff(moment(), 'seconds');
      return timeRemaining < 0 ? 0 : timeRemaining;
    };
  })
  .filter('timeOnlyDuration', function(){
    return function(value) {
      var result = [];
      var duration = moment.duration(value);
      var hours = Math.floor(duration.asHours());
      var minutes = duration.minutes();
      var seconds = duration.seconds();

      // If we have negative duration then normalize it to zero, don't show negative durations
      if (hours < 0 || minutes < 0 || seconds < 0) {
        hours = minutes = seconds = 0;
      }

      if (hours) {
        result.push(hours + "h");
      }

      if (minutes) {
        result.push(minutes + "m");
      }

      // Only show seconds if not duration doesn't include hours.
      // Always show seconds otherwise (even 0s).
      if (!hours) {
        result.push(seconds + "s");
      }

      return result.join(" ");
    };
  });
