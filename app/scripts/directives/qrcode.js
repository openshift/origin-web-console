'use strict';

/**
 * @ngdoc component
 * @name qrcode
 */
angular.module('openshiftConsole').directive('qrcode', function () {
  return {
    template: '<div class="qrcode-container"></div>',
    scope: {
      content: '<?'
    },
    link: function ($scope, element, attrs) {
      var qrCodeContainer = $('.qrcode-container', element);
      qrCodeContainer.qrcode({
        text: $scope.content,
        size: 250
      });

      $scope.$watch('content', function () {
        qrCodeContainer.find('canvas').remove();
        qrCodeContainer.qrcode({
          text: $scope.content,
          size: 250
        });
      });
    }
  };
});
