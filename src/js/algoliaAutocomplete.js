import search from 'algoliasearch';


import eeConfig from './eeConfig';
console.log(eeConfig);

var common = require('./common')(eeConfig);
var autocomplete = require('./autocomplete')(eeConfig);
document.addEventListener("DOMContentLoaded", function(event) { 
    autocomplete.init();
});
