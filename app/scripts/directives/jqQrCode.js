'use strict';

angular.module('openshiftConsole').directive('jqQrCode', function () {
  return {
    template: "<div class='qr-code-container'></div>",
    scope: {
      content: '<?'
    },
    link: function ($scope, element) {
      var qrCodeContainer = $('.qr-code-container', element);
      var createQrCode = function(container, content) {
        container.qrcode({
          text: content,
          size: 250
        });
      };

      createQrCode(qrCodeContainer, $scope.content);

      $scope.$watch('content', function () {
        qrCodeContainer.find('canvas').remove();
        createQrCode(qrCodeContainer, $scope.content);
      });
    }
  };
});
