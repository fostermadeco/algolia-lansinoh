import $ from 'jquery';
import algoliasearch from 'algoliasearch';
import autocomplete from 'autocomplete.js';
import Hogan from 'hogan.js';

module.exports = function() {
    var algoliaConfig = window.algoliaConfig;
    var common = require('./common')();

    return {
        init: init
    };
    
    function init() {

        /** We have nothing to do here if autocomplete is disabled **/
        if (!algoliaConfig.autocomplete.enabled) {
            return;
        }
        
        /**
         * Set autocomplete templates
         * For templating is used Hogan library
         * Docs: http://twitter.github.io/hogan.js/
         **/
        algoliaConfig.autocomplete.templates = {
            suggestions: Hogan.compile($('#autocomplete_suggestions_template').html()),
            products: Hogan.compile($('#autocomplete_products_template').html()),
            categories: Hogan.compile($('#autocomplete_categories_template').html()),
            pages: Hogan.compile($('#autocomplete_pages_template').html()),
            additionnalSection: Hogan.compile($('#autocomplete_extra_template').html())
        };
        
        /**
         * Initialise Algolia client
         * Docs: https://www.algolia.com/doc/javascript
         **/
        var algoliaClient = algoliasearch(algoliaConfig.applicationId, algoliaConfig.autocomplete.apiKey);
        algoliaClient.addAlgoliaAgent('ExpressionEngine integration (' + algoliaConfig.extensionVersion + ')');
        
        /** Add products and categories that are required sections **/
        var nb_cat = algoliaConfig.autocomplete.nbOfCategoriesSuggestions >= 1 ? algoliaConfig.autocomplete.nbOfCategoriesSuggestions : 2;
        var nb_pro = algoliaConfig.autocomplete.nbOfProductsSuggestions >= 1 ? algoliaConfig.autocomplete.nbOfProductsSuggestions : 6;
        var nb_que = algoliaConfig.autocomplete.nbOfQueriesSuggestions >= 0 ? algoliaConfig.autocomplete.nbOfQueriesSuggestions : 0;
        
        if (nb_que > 0) {
            algoliaConfig.autocomplete.sections.unshift({ hitsPerPage: nb_que, label: '', name: "suggestions"});
        }
        
        // algoliaConfig.autocomplete.sections.unshift({ hitsPerPage: nb_cat, label: algoliaConfig.translations.categories, name: "categories"});
        // algoliaConfig.autocomplete.sections.unshift({ hitsPerPage: nb_pro, label: algoliaConfig.translations.products, name: "products"});
        
        /** Setup autocomplete data sources **/
        var sources = [],
            i = 0;
        $.each(algoliaConfig.autocomplete.sections, function (name, section) {
            var source = common.getAutocompleteSource(section, algoliaClient, $, i);
            
            if (source) {
                sources.push(source);
            }
            
            /** Those sections have already specific placeholder, so do not use the default aa-dataset-{i} class **/
            if (section.name !== 'suggestions' && section.name !== 'products') {
                i++;
            }
        });

        /**
         * ADD YOUR CUSTOM DATA SOURCE HERE
         **/
        
        /**
         * Setup the autocomplete search input
         * For autocomplete feature is used Algolia's autocomplete.js library
         * Docs: https://github.com/algolia/autocomplete.js
         **/
        $(algoliaConfig.autocomplete.selector).each(function (i) {
            var menu = $(this);
            var options = {
                hint: false,
                templates: {
                    dropdownMenu: '#menu-template'
                },
                dropdownMenuContainer: "#algolia-search-autocomplete-container",
                debug: false
            };
            
            if (algoliaConfig.removeBranding === false) {
                options.templates.footer = '<div class="footer_algolia"><span>' +algoliaConfig.translations.searchBy + '</span> <a href="https://www.algolia.com/?utm_source=magento&utm_medium=link&utm_campaign=magento_autocompletion_menu" target="_blank"><img src="' +algoliaConfig.urls.logo + '" /></a></div>';
            }
            
            /** Bind autocomplete feature to the input */
            autocomplete(algoliaConfig.autocomplete.selector, options, sources)
                .parent()
                .attr('id', 'algolia-autocomplete-tt')
                .on('autocomplete:selected', function (e, suggestion, dataset) {
                    location.assign(suggestion.url);
                });
            
        });

    };


};