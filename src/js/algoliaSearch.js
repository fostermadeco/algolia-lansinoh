var autocomplete = require('./autocomplete')();
var instantsearch = require('./instantsearch')();

document.addEventListener("DOMContentLoaded", function(event) { 
    instantsearch.init();
    autocomplete.init();
    autocomplete.addTabs();
});
