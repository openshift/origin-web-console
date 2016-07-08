'use strict';

angular.module("openshiftConsole")
  .factory("ChartsService", function(Logger) {
    return {
      updateDonutCenterText: function(element, titleBig, titleSmall) {
        var donutChartTitle = d3.select(element).select('text.c3-chart-arcs-title');
        if (!donutChartTitle) {
          Logger.warn("Can't select donut title element");
          return;
        }

        // Replace donut title content.
        donutChartTitle.selectAll('*').remove();
        donutChartTitle
          .insert('tspan')
          .text(titleBig)
          .classed(titleSmall ? 'donut-title-big-pf' : 'donut-title-med-pf', true)
          .attr('dy', titleSmall ? 0 : 5)
          .attr('x', 0);

        if(titleSmall) {
          donutChartTitle
            .insert('tspan')
            .text(titleSmall)
            .classed('donut-title-small-pf', true)
            .attr('dy', 20)
            .attr('x', 0);
        }
      }
    };
  });
