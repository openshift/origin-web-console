'use strict';

try { angular.module("kubernetesUI") } catch(e) { angular.module("kubernetesUI", []) }

angular.module('kubernetesUI')
.factory('LabelFilter', function($location, gettext, gettextCatalog) {
  function LabelFilter() {
    this._existingLabels = {};
    this._labelSelector = new LabelSelector(null, true);
    this._onActiveFiltersChangedCallbacks = $.Callbacks();
  }

  LabelFilter.prototype.addLabelSuggestionsFromResources = function(items, map) {
    // check if we are extracting from a single item or a hash of items
    if (items.metadata && items.metadata.name) {
      this._extractLabelsFromItem(items, map);
    }
    else {
      var self = this;
      angular.forEach(items, function(item) {
        self._extractLabelsFromItem(item, map);
      });
    }
  };

  LabelFilter.prototype.setLabelSuggestions = function(suggestions) {
    this._existingLabels = suggestions;
    if (this._labelFilterKeySelectize) {
      this._labelFilterKeySelectize.clearOptions();
      var self = this;
      this._labelFilterKeySelectize.load(function(callback) {
        callback(self._getLabelFilterKeys());
      });
    }
  };

  LabelFilter.prototype.persistFilterState = function(persist) {
    this._shouldPersistState = !!persist;
  };

  LabelFilter.prototype._persistState = function() {
    if (!this._shouldPersistState)  {
      return;
    }
    if (this._labelSelector.isEmpty()) {
      var search = $location.search();
      search.labelFilter = null;
      $location.replace().search(search);
    }
    else {
      var search = $location.search();
      search.labelFilter = this._labelSelector.exportJSON();
      $location.replace().search(search);
    }
  };

  LabelFilter.prototype.readPersistedState = function() {
    var labelFilterStr = $location.search().labelFilter;
    if (labelFilterStr) {
      try {
        this._labelSelector = new LabelSelector(JSON.parse(labelFilterStr), true);
      }
      catch(e) {
        // wasn't valid JSON so don't use the data
        this._labelSelector = new LabelSelector({}, true);
      }
    }
    else {
      this._labelSelector = new LabelSelector({}, true);
    }
  };

  LabelFilter.prototype._extractLabelsFromItem = function(item, map) {
    var labels = item.metadata ? item.metadata.labels : {};
    var self = this;
    angular.forEach(labels, function(value, key) {
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push({value: value});
    });
  };

  LabelFilter.prototype.getLabelSelector = function() {
    return this._labelSelector;
  };


  LabelFilter.prototype.setLabelSelector = function(labelSelector, dontFireCallbacks) {
    // This can potentially get called before the label filter has been created
    if (this._labelFilterActiveFiltersElement) {
      this._labelFilterActiveFiltersElement
        .find('.label-filter-active-filter')
        .remove();
    }

    this._labelSelector = labelSelector;

    if (this._labelFilterActiveElement) {
      if (!this._labelSelector.isEmpty()) {
        this._labelFilterActiveElement.show();
        var self = this;
        this._labelSelector.each(function(filter) {
          self._renderActiveFilter(filter);
        });
      }
      else {
        this._labelFilterActiveElement.hide();
      }
    }

    this._persistState();

    if (!dontFireCallbacks) {
      this._onActiveFiltersChangedCallbacks.fire(this._labelSelector);
    }
  };

  LabelFilter.prototype.onActiveFiltersChanged = function(callback) {
    this._onActiveFiltersChangedCallbacks.add(callback);
  };

  // Creates the filtering widget input inside of filterInputElement
  // Creates the filtering widget active filters boxes inside of activeFiltersElement
  // filterInputElement and activeFiltersElement should be empty HTML nodes
  LabelFilter.prototype.setupFilterWidget = function(filterInputElement, activeFiltersElement, opts) {
    var self = this;
    var opts = opts || {};

    this._labelFilterRootElement = filterInputElement;
    this._labelFilterActiveFiltersRootElement = activeFiltersElement;

    // Render base select boxes and buttons for inputs of widget
    var labelFilterElem = $('<div>')
      .addClass("label-filter")
      .appendTo(filterInputElement);

    this._labelFilterKeyInput = $('<select>')
      .addClass("label-filter-key")
      .attr("placeholder", gettextCatalog.getString(gettext('Filter by label')) + ' ')
      .appendTo(labelFilterElem);

    this._labelFilterOperatorInput = $('<select>')
      .addClass("label-filter-operator")
      .attr("placeholder", "matching(...)")
      .hide()
      .appendTo(labelFilterElem);

    this._labelFilterValuesInput = $('<select>')
      .addClass("label-filter-values")
      .attr("placeholder", "Value(s)")
      .attr("multiple", true)
      .hide()
      .appendTo(labelFilterElem);

    this._labelFilterAddBtn = $('<button>')
      .addClass("label-filter-add btn btn-default disabled")
      .attr("disabled", true)
      .appendTo(filterInputElement)
      .append(
        $('<span>')
          .text(opts.addButtonText || "Add Filter")
      );

    this._labelFilterActiveFiltersElement = $('<span>')
      .addClass("label-filter-active-filters")
      .appendTo(activeFiltersElement);

    // Render active filters area
    this._labelFilterActiveElement = $('<span>')
      .addClass("label-filter-clear")
      .hide()
      .appendTo(this._labelFilterActiveFiltersElement)
      .append(
        $('<a>')
          .addClass("label-filtering-remove-all label label-primary")
          .prop("href", "javascript:;")
          .append(
            $('<i>')
              .addClass("fa fa-filter")
          )
          .append(
            $('<span>')
              .text("Clear filters")
          )
      ).click(function() {
        self.clear();
      });

    // Create selectize widgets for the select fields and wire them together
    this._labelFilterKeyInput.selectize({
      dropdownParent: "body",
      valueField: "key",
      labelField: "key",
      searchField: ["key"],
      create: true,
      persist: true, // i want this to be false but there appears to be a bug in selectize where setting
                     // this to false has a side effect of causing items that were not created by the user
                     // to also disappear from the list after being removed
      preload: true,
      onItemAdd: function(value, $item) {
        var selectizeValues = self._labelFilterValuesSelectize;
        selectizeValues.clearOptions();
        selectizeValues.load(function(callback) {
          var options = [];
          var key = self._labelFilterKeySelectize.getValue();
          if (!key) {
            return options;
          }
          var optionsMap = self._existingLabels;
          // if there are no values for this key, like when user chooses to explicitly add a key
          // then there are no values to suggest
          if (!optionsMap[key]) {
            callback({});
            return;
          }
          //for each value for key
          for (var i = 0; i < optionsMap[key].length; i++) {
            options.push(optionsMap[key][i]);
          }
          callback(options);
        });

        self._labelFilterOperatorSelectizeInput.css("display", "inline-block");
        var operator = self._labelFilterOperatorSelectize.getValue();
        if (!operator) {
          self._labelFilterOperatorSelectize.focus();
        }
        else {
          selectizeValues.focus();
        }
      },
      onItemRemove: function(value) {
        self._labelFilterOperatorSelectizeInput.hide();
        self._labelFilterOperatorSelectize.clear();
        self._labelFilterValuesSelectizeInput.hide();
        self._labelFilterValuesSelectize.clear();
        self._labelFilterAddBtn.addClass("disabled").prop('disabled', true);
      },
      load: function(query, callback) {
        callback(self._getLabelFilterKeys())
      },
      onFocus: function() {
        labelFilterElem.addClass("filter-active");
      },
      onBlur: function() {
        labelFilterElem.removeClass("filter-active");
      }
    });

    this._labelFilterKeySelectize = this._labelFilterKeyInput.prop("selectize");
    this._labelFilterKeySelectizeInput = $('.selectize-control.label-filter-key', labelFilterElem);

    this._labelFilterOperatorInput.selectize({
      dropdownParent: "body",
      valueField: "type",
      labelField: "label",
      searchField: ["label"],
      options: [
        {type: "exists", label: "exists"},
        {type: "does not exist", label: "does not exist"},
        {type: "in", label: "in ..."},
        {type: "not in", label: "not in ..."}
      ],
      onItemAdd: function(value, $item) {
        // if we selected "exists" enable the add button and stop here
        if (value == "exists" || value == "does not exist") {
          self._labelFilterAddBtn.removeClass("disabled").prop('disabled', false).focus();
          return;
        }

        // otherwise
        self._labelFilterValuesSelectizeInput.css("display", "inline-block");
        self._labelFilterValuesSelectize.focus();
      },
      onItemRemove: function(value) {
        self._labelFilterValuesSelectizeInput.hide();
        self._labelFilterValuesSelectize.clear();
        self._labelFilterAddBtn.addClass("disabled").prop('disabled', true);
      },
      onFocus: function() {
        labelFilterElem.addClass("filter-active");
      },
      onBlur: function() {
        labelFilterElem.removeClass("filter-active");
      }
    });

    this._labelFilterOperatorSelectize = this._labelFilterOperatorInput.prop("selectize");
    this._labelFilterOperatorSelectizeInput = $('.selectize-control.label-filter-operator', labelFilterElem);
    this._labelFilterOperatorSelectizeInput.hide();

    this._labelFilterValuesInput.selectize({
      dropdownParent: "body",
      valueField: "value",
      labelField: "value",
      searchField: ["value"],
      plugins: ['remove_button'],
      create: true,
      persist: true, // i want this to be false but there appears to be a bug in selectize where setting
                     // this to false has a side effect of causing items that were not created by the user
                     // to also disappear from the list after being removed
      preload: true,
      onItemAdd: function(value, $item) {
        self._labelFilterAddBtn.removeClass("disabled").prop('disabled', false);
      },
      onItemRemove: function(value) {
        // disable button if we have removed all the values
      },
      load: function(query, callback) {
        var options = [];
        var key = self._labelFilterKeySelectize.getValue();
        if (!key) {
          return options;
        }
        var optionsMap = self._existingLabels;
        // if there are no values for this key, like when user chooses to explicitly add a key
        // then there are no values to suggest
        if (!optionsMap[key]) {
          callback({});
          return;
        }
        //for each value for key
        for (var i = 0; i < optionsMap[key].length; i++) {
          options.push(optionsMap[key][i]);
        }
        callback(options);
      },
      onFocus: function() {
        labelFilterElem.addClass("filter-active");
      },
      onBlur: function() {
        labelFilterElem.removeClass("filter-active");
      }
    });

    this._labelFilterValuesSelectize = this._labelFilterValuesInput.prop("selectize");
    this._labelFilterValuesSelectizeInput = $('.selectize-control.label-filter-values', labelFilterElem);
    this._labelFilterValuesSelectizeInput.hide();

    this._labelFilterAddBtn.click(function() {
      // grab the values before clearing out the fields
      var key = self._labelFilterKeySelectize.getValue();
      var operator = self._labelFilterOperatorSelectize.getValue();
      var values = self._labelFilterValuesSelectize.getValue();

      self._labelFilterKeySelectize.clear();
      self._labelFilterOperatorSelectizeInput.hide();
      self._labelFilterOperatorSelectize.clear();
      self._labelFilterValuesSelectizeInput.hide();
      self._labelFilterValuesSelectize.clear();
      self._labelFilterAddBtn.addClass("disabled").prop('disabled', true);

      // show the filtering active indicator and add the individual filter to the list of active filters
      self.addActiveFilter(key, operator, values);
    });

    // If we are transitioning scenes we may still have filters active but be re-creating the DOM for the widget
    if (!this._labelSelector.isEmpty()) {
      this._labelFilterActiveElement.show();
      this._labelSelector.each(function(filter) {
        self._renderActiveFilter(filter);
      });
    }
  };

  LabelFilter.prototype._getLabelFilterKeys = function() {
    var options = [];
    var keys = Object.keys(this._existingLabels);
    for (var i = 0; i < keys.length; i++) {
      options.push({
        key: keys[i]
      });
    }

    return options;
  }

  LabelFilter.prototype.addActiveFilter = function(key, operator, values) {
    this._labelFilterActiveElement.show();
    this._addActiveFilter(key, operator, values);
  };

  LabelFilter.prototype._addActiveFilter = function(key, operator, values) {
    var filter = this._labelSelector.addConjunct(key, operator, values);
    this._persistState();
    this._onActiveFiltersChangedCallbacks.fire(this._labelSelector);
    this._renderActiveFilter(filter);
  };

  LabelFilter.prototype.clear = function() {
    if (this._labelFilterActiveFiltersElement) {
      this._labelFilterActiveFiltersElement.find('.label-filter-active-filter').remove();
    }

    if (this._labelFilterActiveElement) {
      this._labelFilterActiveElement.hide();
    }

    this._labelSelector.clearConjuncts();
    this._persistState();
    this._onActiveFiltersChangedCallbacks.fire(this._labelSelector);
  };

  LabelFilter.prototype._renderActiveFilter = function(filter) {
    // render the new filter indicator
    $('<a>')
      .addClass("label label-default label-filter-active-filter")
      .prop("href", "javascript:;")
      .prop("filter-label-id", filter.id)
      .click($.proxy(this, '_removeActiveFilter'))
      .append(
        $('<span>')
          .text(filter.string)
      )
      .append(
        $('<i>')
          .addClass("fa fa-times")
      )
      .appendTo(this._labelFilterActiveFiltersElement);
  };

  LabelFilter.prototype._removeActiveFilter = function(e) {
    var filterElem = $(e.target).closest('.label-filter-active-filter');
    var filter = filterElem.prop("filter-label-id");
    filterElem.remove();
    if($('.label-filter-active-filter', this._labelFilterActiveFiltersElement).length == 0) {
      this._labelFilterActiveElement.hide();
    }

    this._labelSelector.removeConjunct(filter);
    this._persistState();
    this._onActiveFiltersChangedCallbacks.fire(this._labelSelector);
  };

  LabelFilter.prototype.toggleFilterWidget = function(show) {
    if (this._labelFilterRootElement) {
      if (show) {
        this._labelFilterRootElement.show();
      }
      else {
        this._labelFilterRootElement.hide();
      }
    }
    if (this._labelFilterActiveFiltersRootElement) {
      if (show) {
        this._labelFilterActiveFiltersRootElement.show();
      }
      else {
        this._labelFilterActiveFiltersRootElement.hide();
      }
    }
  };

  return new LabelFilter();
});
