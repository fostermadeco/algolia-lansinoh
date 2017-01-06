var autocomplete = require('./autocomplete')();
var instantsearch = require('./instantsearch')();

var algoliaConfig = window.algoliaConfig;
var common = require('./common')(algoliaConfig);

document.addEventListener("DOMContentLoaded", function(event) { 
    common.misc();
    autocomplete.init();
    instantsearch.init();
    instantsearch.addTabs();
});
