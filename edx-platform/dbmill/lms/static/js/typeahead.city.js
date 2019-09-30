var ENEXT = ENEXT || {};

ENEXT.cityValues = (function(){

  var selectModifier = '';

  var anchorTo = function(selector, modifier) {

    selectModifier = modifier;
    CreateCityTypeahead(selector);

  };

  //City typeahead creation
  var CreateCityTypeahead = function(selector) {
    var data = new Bloodhound({
      datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum['city']);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: 'static/dbmill/js/all-cities.js'
    });

    data.clearPrefetchCache();
    data.initialize(true);

    $(selector).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'Ubicaciones',
      displayKey: 'city',
      source: function(query, cb) {
        data.search(query, function(suggestions) {
          cb(filter(suggestions));
        });
      }
    });

  };

  //this function is intended to filter suggestions according selected country
  var filter = function(suggestions) {
    var countryVal = $(selectModifier).val();

    if ( !countryVal ) {
      return suggestions;
    }

    var filteredSuggestions = [];
    filteredSuggestions = $.grep(suggestions, function(suggestion) {
      return suggestion.country == countryVal;
    });

    return filteredSuggestions;
  }

  var api = {
    anchorTo: anchorTo
  };

  // *********************** Only for testing purposes ********************

  // api.__testing__ = {};
  // api.__testing__.add_element = add_element;

  // *********************** Only for testing purposes ********************

  return api;

})();
