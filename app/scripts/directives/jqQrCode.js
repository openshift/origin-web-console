'use strict';

/**
 * @ngdoc component
 * @name jq-qr-code
 */
angular.module('openshiftConsole').directive('jqQrCode', function () {
  return {
    template: "<div class='qr-code-container'></div>",
    scope: {
      content: '<?'
    },
    link: function ($scope, element) {
      var qrCodeContainer = $('.qr-code-container', element);
      // create new qrcode
      qrCodeContainer.qrcode({
        text: $scope.content,
        size: 250
      });

      $scope.$watch('content', function () {
        // remove old qrcode
        qrCodeContainer.find('canvas').remove();
        // add qrcode when content element updated
        qrCodeContainer.qrcode({
          text: $scope.content,
          size: 250
        });
      });
    }
  };
});
