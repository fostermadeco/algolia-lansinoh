import search from 'algoliasearch';

var common = require('./common')();
var autocomplete = require('./autocomplete')();
document.addEventListener("DOMContentLoaded", function(event) { 
    autocomplete.init();
});
