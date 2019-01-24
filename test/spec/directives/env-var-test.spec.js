'use strict';

var scope;
var elem;
var timeout;
var compile;

var setup = function() {
  inject(function($rootScope, $timeout, $compile) {
    timeout = $timeout;
    scope = $rootScope.$new();
    compile = $compile;
  });
};

var noEntries = function() {
  scope.entries = [];
};

var standardEntries = function() {
  scope.entries = [{
    name: 'DB_USER',
    value: 'user12345'
  }, {
    name: 'DB_PASSWORD',
    value: 'p@55w0rd'
  }, {
    name: 'DB_SERVER',
    value: 'foo.com'
  }];
};

var render = function() {
  compile(elem)(scope);
  if(!scope.entries) {
    throw new Error('>> $scope.entries must be provided as an array before render()');
  }
  $('body').append(elem);
  scope.$apply();
};

var tearDown = function() {
  $('body').empty();
};



describe('keyValueEditor add-row-link', function() {
  beforeEach(module('openshiftConsole'));

  beforeEach(function() {
    setup();
  });

  afterEach(function() {
    tearDown();
  });

  /*
  var withoutAddRow = function() {
    elem = angular.element('<key-value-editor entries="entries"></key-value-editor>');
    scope.entries = [];
  };
  */

  var withAddRow = function() {
    elem = angular.element('<key-value-editor entries="entries" add-row-link></key-value-editor>');
    scope.entries = [];
  };

  var withCustomAddRow = function() {
    elem = angular.element('<key-value-editor entries="entries" add-row-link="Add some stuff will ya"></key-value-editor>');
    scope.entries = [];
  };


  /*
  TODO Do we still support env-var without add-row?
  describe('without add-row-link attribute', function() {
    it('should display the default 4 inputs', function() {
      withoutAddRow();
      render();
      expect($('input:text').length).toEqual(4);
    });
  });
  */

  describe('with add-row-link attribute', function() {
    it('does not display the extra set of inputs for triggering new rows', function() {
      withAddRow();
      render();
      var inputs = $('input:text');
      expect(inputs.length).toEqual(2);
    });

    it('does display an add-row-link', function() {
      withAddRow();
      render();
      var link = $('.add-row-link');
      expect(link.length).toEqual(1);
    });

    it('adds a new row when the add-row-link is clicked', function() {
      withAddRow();
      render();
      $('.add-row-link').click();
      expect($('input:text').length).toEqual(4);
    });

    it('should add rows multiple times', function() {
      withAddRow();
      render();
      var timesToClick = 10;
      _.times(timesToClick, function() {
        $('.add-row-link').click();
      });
      expect($('input:text').length).toEqual((timesToClick * 2) + 2);
    });
  });

  describe('with custom add-row-link attribute text', function() {
    it('should display the link with the custom text instead of the default', function() {
      withCustomAddRow();
      render();
      expect($('.add-row-link').text()).toEqual('Add some stuff will ya');
      expect($('.add-row-link').text()).not.toEqual('Add row');

    });
  });

  // todo: default text, configured text
});

describe('keyValueEditor default', function() {

  beforeEach(module('openshiftConsole'));

  beforeEach(function() {
    setup();
  });

  afterEach(function() {
    tearDown();
  });

  var withDefaults = function() {
    elem = angular.element('<key-value-editor entries="entries"></key-value-editor>');
  };

  var withSomeReadonlyKeys = function() {
    elem = angular.element('<key-value-editor entries="entries" is-readonly="[\'foo\']" cannot-delete="[\'foo\']"></key-value-editor>');
  };

  describe('setup', function() {
    it('should generate a unique id to use for each input', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.unique).toEqual(1000); // starts with 1000, increments by 1
    });

    it('should generate a set-focus class for the key', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.setFocusKeyClass).toEqual('key-value-editor-set-focus-key-1000');
    });


    it('should generate a set-focus class for the value', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.setFocusValClass).toEqual('key-value-editor-set-focus-value-1000');
    });


    it('should generate a named form', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.forms.keyValueEditor).toBeDefined();
    });

  });

  // this only tests the $scope function, consult e2e tests to validate UI
  describe('when given a list of readonly keys', function() {
    it('should treat those keys as readonly', function() {
      withSomeReadonlyKeys();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'bar',
        value: 'baz'
      }];
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.isReadonlySome('foo')).toEqual(true);
      expect(isolate.isReadonlySome('bar')).toEqual(false);
    });
  });

  describe('when given a list of undeletable keys', function() {
    it('should treat those keys as undeletable', function() {
      withSomeReadonlyKeys();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'bar',
        value: 'baz'
      }];
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.cannotDeleteSome('foo')).toEqual(true);
      expect(isolate.cannotDeleteSome('bar')).toEqual(false);
    });
  });



  describe('when given a list of one entry', function() {
    it('should display the name and value of that entry', function() {
      withDefaults();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }];
      render();
      scope.$apply();
      var inputs = $('input:text');
      expect(inputs.eq(0).val()).toEqual('foo');
      expect(inputs.eq(1).val()).toEqual('bar');
    });
  });

  describe('when given a list of entries', function() {
    it('should create one unique label for each unique input', function() {
      withDefaults();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'bar',
        value: 'baz'
      }, {
        name: 'last',
        value: 'one'
      }];
      render();
      var inputs = $('input');
      var labels = [];
      $.each(inputs, function(i, elem) {
        labels.push($('label[for="' + elem.id + '"]'));
      });
      expect(inputs.length).toEqual(labels.length);
    });
  });

  describe('when the delete entry button is clicked', function() {
    it('should delete the corresponding entry by index', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      isolate.deleteEntry(1, 1);
      expect(angular.copy(isolate.entries)).toEqual([{
        name: 'DB_USER',
        value: 'user12345'
      },{
        name: 'DB_SERVER',
        value: 'foo.com'
      }]);
    });
  });

});

describe('keyValueEditor header', function() {
  //var kveConfigProvider;
  //var kveConfig;

  beforeEach(module('openshiftConsole'));

  // TODO:For testing a default set via the provider:
  // (sadly this is a pain)
  // (and it should not be beforeEach, if get it working)
  // beforeEach(function() {
  //   module(['keyValueEditorConfigProvider', function(keyValueEditorConfigProvider) {
  //     kveConfigProvider = keyValueEditorConfigProvider;
  //     kveConfigProvider.set('keyPlaceholder', 'Chicken');
  //     kveConfigProvider.set('valuePlaceholder', 'Waffles');
  //   }]);
  // });
  //
  // beforeEach(inject(['keyValueEditorConfig', function(keyValueEditorConfig) {
  //   kveConfig = keyValueEditorConfig;
  // }]));

  afterEach(function() {
    //tearDown();
  });

  var withDefaultHeader = function() {
    elem = angular.element('<key-value-editor ' +
                              'show-header ' +
                              'entries="entries"></key-value-editor>');
  };
  /*
  var withCustomHeader = function() {
    elem = angular.element('<key-value-editor ' +
                              ' entries="entries" ' +
                              ' show-header ' +
                              ' key-placeholder="Bilbo" ' +
                              ' value-placeholder="Frodo"></key-value-editor>');
  };
  */

  describe('when the show-header attribute is present', function() {

    it('displays empty strings by default', function() {
      noEntries();
      withDefaultHeader();
      render();
      scope.$apply();
      expect($('.key-header .help-block').eq(0).text()).toEqual('');
      expect($('.value-header .help-block').eq(0).text()).toEqual('');
    });

    /*
    TODO Fails due to elem being undefined despite being used in withCustomheader();
    it('displays headers using the key-placeholder and value-placeholder' + elem, inject(function($timeout) {
      noEntries();
      withCustomHeader();
      render();
      scope.$apply();
      expect(elem.isolateScope().showHeader ).toEqual(true);
      // selector doesnt work here, not sure why...?
      //expect($('.value-header .help-block').eq(0).text()).toEqual('Frodo');
    }));
    */

    // TODO: For testing a default set via the provider:
    // (sadly this is a pain)
    // it('displays configured placeholders, if set via the keyValueEditorConfig provider', function() {
    //   noEntries();
    //   withDefaultHeader();
    //   render();
    //   scope.$apply();
    //   expect($('.key-header .help-block').eq(0).text()).toEqual('Chicken');
    //   expect($('.value-header .help-block').eq(0).text()).toEqual('Waffles');
    // });

  });
});
