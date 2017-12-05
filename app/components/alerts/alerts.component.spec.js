"use strict";

describe("Component: Alerts", function(){

  var $scope, $compile, element;
  beforeEach(inject(function(_$compile_, _$rootScope_) {
      $scope = _$rootScope_;
      $compile = _$compile_;
      $scope.alerts = {
        danger: {
          type: "error",
          message: "An error happened and stuff.",
          details: "Errors are bad.",
          links: [
            {
              label: "test_link"
            }
          ]
        },
        warning: {
          type: "warning",
          message: "I'm going to count to five."
        },
        success: {
          type: "success",
          message: "Huzzah!"
        },
        info: {
          message: "This is informational."
        }
      };

      $scope.filter = function(alert){
        return alert.type && alert.type === "error";
      };

      // Create an instance of the component
      element = angular.element('<alerts alerts="alerts"></alerts>');
      element = $compile(element)($scope); // Compile the component
      $scope.$digest(); // Update the HTML
  }));

  // Ensure four alert elements exist
  it("should contain four alert elements", function () {
    var allAlerts = element.find('.alert');
    expect(allAlerts.length).toBe(4); // four alerts exist
  });

  // Ensure danger alert exists and is correct
  it("should contain an error type alert", function(){
    var danger = $(element.find('.alert')[0]);
    expect(danger.hasClass('alert-danger')).toBeTruthy(); // danger alert has correct class
    expect(danger.text()).toContain("An error happened and stuff."); // danger alert contains correct text
    expect(danger.text()).toContain("Errors are bad."); // danger alert contains correct text
  });

  // Ensure warning alert exists and is correct
  it("should contain a warning type alert", function(){
    var warning = $(element.find('.alert')[1]);
    expect(warning.hasClass('alert-warning')).toBeTruthy(); // warning alert has correct class
    expect(warning.text()).toContain("I'm going to count to five."); // warning alert contains correct text
  });

  // Ensure success alert exists and is correct
  it("should contain a success type alert", function(){
    var success = $(element.find('.alert')[2]);
    expect(success.hasClass('alert-success')).toBeTruthy(); // success alert has correct class
    expect(success.text()).toContain("Huzzah!"); // success alert contains correct text
  });

  // Ensure info alert exists and is correct
  it("should contain an info type alert", function(){
    var info = $(element.find('.alert')[3]);
    expect(info.hasClass('alert-info')).toBeTruthy(); // info alert has correct class
    expect(info.text()).toContain("This is informational."); // info alert contains correct text
  });

  // Ensure `close` callback is called when close button is clicked, and the
  // hidden state is true.
  it("should call controller close function when close button is clicked", function(){
    $scope.onCloseSpy = jasmine.createSpy('onCloseSpy');
    $scope.alerts.danger.onClose = $scope.onCloseSpy;
    $scope.$digest();

    expect($scope.alerts.danger.hidden).toBeFalsy(); // alert is not in hidden state
    element.find('.alert.alert-danger .close').click(); // click close button
    expect($scope.onCloseSpy).toHaveBeenCalled(); // controller close function was called
    expect($scope.alerts.danger.hidden).toBeTruthy(); // alert is in hidden state
  });

  // Ensure link 'onClick' handler is called and alert is dismissed when the
  // handler returns true.
  it("should handle link clicks", function(){
    $scope.onClickSpy = jasmine.createSpy('onClickSpy').and.returnValue(true); // create jasmine spy that returns true.
    $scope.alerts.danger.links[0].onClick = $scope.onClickSpy;
    $scope.$digest();

    expect($scope.alerts.danger.hidden).toBeFalsy(); // alert is not in hidden state
    expect(element.text()).toContain('test_link'); // link text exists in alert element
    element.find('.alert.alert-danger a').click(); // click link
    expect($scope.onClickSpy).toHaveBeenCalled(); // link onClick handler was called
    expect($scope.alerts.danger.hidden).toBeTruthy(); // alert is in hidden state
  });

  // Ensure filter works as expected. Predicate defined in $scope.filter should
  // filter out all alerts that are not of the type "error".
  it('should filter out all alerts except error type alerts', function(){
    element = angular.element('<alerts alerts="alerts" filter="filter"></alerts>');
    element = $compile(element)($scope); // Compile the component
    $scope.$digest(); // Update the HTML

    var alerts = element.find('.alert');
    expect(alerts.length).toBe(1);
    expect($(alerts[0]).hasClass('alert-danger')).toBeTruthy();
  });

  // Make sure the close button does not appear in any of the alerts when the
  // "hide-close-button" attribute is true.
  it('should not include close button element in alerts', function(){
    element = angular.element('<alerts alerts="alerts" hide-close-button="true"></alerts>');
    element = $compile(element)($scope); // Compile the component
    $scope.$digest(); // Update the HTML
    expect(element.find('button.close').length).toBe(0);
  });

});
