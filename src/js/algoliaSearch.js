const autocomplete = require('./autocomplete')();
const instantsearch = require('./instantsearch')();

const common = require('./common')();

document.addEventListener("DOMContentLoaded", function(event) { 
    common.misc();
    autocomplete.init();
    instantsearch.init();
    instantsearch.addTabs();
});
