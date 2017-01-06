var autocomplete = require('./autocomplete')();
var instantsearch = require('./instantsearch')();

document.addEventListener("DOMContentLoaded", function(event) { 
    autocomplete.init();
    instantsearch.init();
    instantsearch.addTabs();
});
