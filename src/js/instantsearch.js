import $ from 'jquery';
import instantsearch from 'instantsearch.js';

module.exports = function() {
    var algoliaConfig = window.algoliaConfig;
    var common = require('./common')(algoliaConfig);
    var templates = require('../templates')();

    return {
        init: init,
        addTabs: addTabs
    }
    function init() {

        // check specifically for a search page
        var pathArray = window.location.pathname.split( '/' );
        if (pathArray[2] !== 'search' && pathArray[1] !== 'catalogsearch' && location.host !== '127.0.0.1:8080') {
            return;
        }

        /** We have nothing to do here if instantsearch is not enabled **/
        // if (!algoliaConfig.instant.enabled || !(algoliaConfig.isSearchPage || !algoliaConfig.autocomplete.enabled)) {
        //     return;
        // }

        if ($(algoliaConfig.instant.selector).length <= 0) {
            throw '[Algolia] Invalid instant-search selector: ' + algoliaConfig.instant.selector;
        }

        if (algoliaConfig.autocomplete.enabled && $(algoliaConfig.instant.selector).find(algoliaConfig.autocomplete.selector).length > 0) {
            throw '[Algolia] You can\'t have a search input matching "' + algoliaConfig.autocomplete.selector +
            '" inside you instant selector "' + algoliaConfig.instant.selector + '"';
        }

        /**
         * Setup wrapper
         *
         * For templating is used Hogan library
         * Docs: http://twitter.github.io/hogan.js/
         **/
        var wrapperTemplate = templates['instant_wrapper_template'];
        var instantSelector = "#instant-search-bar";
        
        var div = document.createElement('div');
        $(div).addClass('algolia-instant-results-wrapper');
        
        $(algoliaConfig.instant.selector).addClass('algolia-instant-replaced-content');
        $(algoliaConfig.instant.selector).wrap(div);
        
        $('.algolia-instant-results-wrapper').append('<div class="algolia-instant-selector-results"></div>');
        $('.algolia-instant-selector-results').html(wrapperTemplate.render({
            second_bar: true,
            config: algoliaConfig.instant,
            translations: algoliaConfig.translations
        })).show();

        /**
         * Initialise instant search
         * For rendering instant search page is used Algolia's instantsearch.js library
         * Docs: https://community.algolia.com/instantsearch.js/documentation/
         **/
        
        var pages = instantsearch({
            appId: algoliaConfig.applicationId,
            apiKey: algoliaConfig.instant.apiKey,
            indexName: 'EE_Content',
            urlSync: {
                useHash: true,
                trackedParameters: ['query', 'page', 'attribute:*']
            }
        });

        var products = instantsearch({
            appId: algoliaConfig.applicationId,
            apiKey: algoliaConfig.instant.apiKey,
            indexName: algoliaConfig.indexName + '_products',
            searchFunction: function(helper) {
                var query = helper.state.query;
                pages.helper.setQuery(query);
                pages.helper.search();
                helper.search();
            },
            urlSync: {
                useHash: true,
                trackedParameters: ['query', 'page', 'attribute:*']
            }
        });
        
        products.client.addAlgoliaAgent('ExpressionEngine integration (' + algoliaConfig.extensionVersion + ')');
        
        /**
         * Custom widget - this widget is used to refine results for search page or catalog page
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#custom-widgets
         **/
        // search.addWidget({
        //     getConfiguration: function () {
        //         if (algoliaConfig.request.query.length > 0 && location.hash.length < 1) {
        //             return {query: algoliaConfig.request.query}
        //         }
        //         return {};
        //     },
        //     init: function (data) {
        //         if (algoliaConfig.request.refinementKey.length > 0) {
        //             data.helper.toggleRefine(algoliaConfig.request.refinementKey, algoliaConfig.request.refinementValue);
        //         }
        //     },
        //     render: function (data) {
        //         // if (data.results.query.length === 0) {
        //         //     $('.algolia-instant-replaced-content').show();
        //         //     $('.algolia-instant-selector-results').hide();
        //         // }
        //         // else {
        //         //     $('.algolia-instant-replaced-content').hide();
        //         //     $('.algolia-instant-selector-results').show();
        //         // }
        //     }
        // });

        /**
        * Search box
        * Docs: https://community.algolia.com/instantsearch.js/documentation/#searchbox
        **/
        var searchBox = instantsearch.widgets.searchBox({
            container: instantSelector,
            placeholder: algoliaConfig.translations.searchFor
        });
        pages.addWidget(searchBox);
        products.addWidget(searchBox);

        /**
         * Stats
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#stats
         **/
        products.addWidget(
            instantsearch.widgets.stats({
                container: '#algolia-stats-products',
                templates: {
                    body: $('#instant-stats-template').html()
                },
                transformData: function (data) {
                    data.first = data.page * data.hitsPerPage + 1;
                    data.last = Math.min(data.page * data.hitsPerPage + data.hitsPerPage, data.nbHits);
                    data.seconds = data.processingTimeMS / 1000;
                    
                    data.translations = algoliaConfig.translations;
                    
                    return data;
                }
            })
        );

        pages.addWidget(
            instantsearch.widgets.stats({
                container: '#algolia-stats-pages',
                templates: {
                    body: $('#instant-stats-template').html()
                },
                transformData: function (data) {
                    data.first = data.page * data.hitsPerPage + 1;
                    data.last = Math.min(data.page * data.hitsPerPage + data.hitsPerPage, data.nbHits);
                    data.seconds = data.processingTimeMS / 1000;
                    
                    data.translations = algoliaConfig.translations;
                    
                    return data;
                }
            })
        );

        /**
         * Sorting
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#sortbyselector
         **/
        // algoliaConfig.sortingIndices.unshift({
        //     name: algoliaConfig.indexName + '_products',
        //     label: algoliaConfig.translations.relevance
        // });
        
        // search.addWidget(
        //     instantsearch.widgets.sortBySelector({
        //         container: '#algolia-sorts',
        //         indices: algoliaConfig.sortingIndices,
        //         cssClass: 'form-control'
        //     })
        // );
        
        /**
         * Products' hits
         * This widget renders all products into result page
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#hits
         **/
        var pagesHits = instantsearch.widgets.hits({
            container: '#instant-search-results-container-pages',
            templates: {
                allItems: $('#instant-hit-page-template').html()
            },
            hitsPerPage: algoliaConfig.hitsPerPage
        });

        var productsHits = instantsearch.widgets.hits({
            container: '#instant-search-results-container-products',
            templates: {
                allItems: $('#instant-hit-product-template').html()
            },
            transformData: {
                allItems: function (results) {
                    for (var i = 0; i < results.hits.length; i++) {
                        results.hits[i] = common.transformHit(results.hits[i], algoliaConfig.priceKey);
                        results.hits[i].isAddToCartEnabled = algoliaConfig.instant.isAddToCartEnabled;
                     
                        results.hits[i].algoliaConfig = window.algoliaConfig;
                    }
                 
                    return results;
                }
            },
            hitsPerPage: algoliaConfig.hitsPerPage
        });
        pages.addWidget(pagesHits);
        products.addWidget(productsHits);
        
        /**
         * Custom widget - Suggestions
         * This widget renders suggestion queries which might be interesting for your customer
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#custom-widgets
         **/
        // search.addWidget({
        //     suggestions: [],
        //     init: function () {
        //         if (algoliaConfig.showSuggestionsOnNoResultsPage) {
        //             var $this = this;
        //             $.each(algoliaConfig.popularQueries.slice(0, Math.min(4, algoliaConfig.popularQueries.length)), function (i, query) {
        //                 query = $('<div>').html(query).text(); //xss
        //                 $this.suggestions.push('<a href="' + algoliaConfig.baseUrl + '/catalogsearch/result/?q=' + encodeURIComponent(query) + '">' + query + '</a>');
        //             });
        //         }
        //     },
        //     render: function (data) {
        //         var $infosContainer = $('#algolia-right-container').find('.infos');
                
        //         if (data.results.hits.length === 0) {
        //             var content = '<div class="no-results">';
        //             content += '<div><b>' + algoliaConfig.translations.noProducts + ' "' + $("<div>").text(data.results.query).html() + '</b>"</div>';
        //             content += '<div class="popular-searches">';
                    
        //             if (algoliaConfig.showSuggestionsOnNoResultsPage && this.suggestions.length > 0) {
        //                 content += '<div>' + algoliaConfig.translations.popularQueries + '</div>' + this.suggestions.join(', ');
        //             }
                    
        //             content += '</div>';
        //             content += algoliaConfig.translations.or + ' <a href="' + algoliaConfig.baseUrl + '/catalogsearch/result/?q=__empty__">' + algoliaConfig.translations.seeAll + '</a>';
                    
        //             content += '</div>';
                    
        //             $('#instant-search-results-container').html(content);
                    
        //             $infosContainer.addClass('hidden');
        //         }
        //         else {
        //             $infosContainer.removeClass('hidden');
        //         }
        //     }
        // });
        
        /** Setup attributes for current refinements widget **/
        var attributes = [];
        $.each(algoliaConfig.facets, function (i, facet) {
            var name = facet.attribute;
            
            if (name === 'categories') {
                if (algoliaConfig.isCategoryPage) {
                    return;
                }
                name = 'categories.level0';
            }
            
            if (name === 'price') {
                name = facet.attribute + algoliaConfig.priceKey
            }
            
            attributes.push({
                name: name,
                label: facet.label ? facet.label : facet.attribute
            });
        });
        
        /**
         * Widget name: Current refinements
         * Widget displays all filters and refinements applied on query. It also let your customer to clear them one by one
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#currentrefinedvalues
         **/
        // search.addWidget(
        //     instantsearch.widgets.currentRefinedValues({
        //         container: '#current-refinements',
        //         cssClasses: {
        //             root: 'facet'
        //         },
        //         templates: {
        //             header: '<div class="name">' + algoliaConfig.translations.selectedFilters + '</div>',
        //             clearAll: algoliaConfig.translations.clearAll,
        //             item: $('#current-refinements-template').html()
        //         },
        //         attributes: attributes,
        //         onlyListedAttributes: true
        //     })
        // );

        /**
         * Pagination
         * Docs: https://community.algolia.com/instantsearch.js/documentation/#pagination
         **/
        products.addWidget(
            instantsearch.widgets.pagination({
                container: '#instant-search-pagination-container-products',
                cssClass: 'algolia-pagination',
                showFirstLast: false,
                maxPages: 1000,
                labels: {
                    previous: algoliaConfig.translations.previousPage,
                    next: algoliaConfig.translations.nextPage
                },
                scrollTo: 'body'
            })
        );

        pages.addWidget(
            instantsearch.widgets.pagination({
                container: '#instant-search-pagination-container-pages',
                cssClass: 'algolia-pagination',
                showFirstLast: false,
                maxPages: 1000,
                labels: {
                    previous: algoliaConfig.translations.previousPage,
                    next: algoliaConfig.translations.nextPage
                },
                scrollTo: 'body'
            })
        );
        
        var isStarted = false;
        function startInstantSearch() {
            if(isStarted == true) {
                return;
            }
            
            pages.start();
            products.start();

            var queryInHash = location.hash
            var queryOnLoad = pages.helper.state.query !== '' ? pages.helper.state.query : common.getQueryFromLocation();

            $(instantSelector).val(queryOnLoad);

            if (algoliaConfig.autocomplete.enabled) {
                $('#search_mini_form').addClass('search-page');
            }
            
            isStarted = true;
        }
        
        /** Initialise searching **/
        startInstantSearch();
    };

    function addTabs() {
        if ($(".search-results-tabs").length === 0) return;
        // Algolia search results tabs
        $(".search-results-tabs li:first-child").addClass("active");
        $("#algolia_instant_selector .tabbed-content:first").addClass("active");
        $(".search-results-tabs li").each(function() {
            $(this).on("click", function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                $("#algolia_instant_selector .tabbed-content").removeClass("active");
                var index = $(this).index();
                $("#algolia_instant_selector .tabbed-content:eq(" + index + ")").addClass("active");
            });
        });
    }
}

