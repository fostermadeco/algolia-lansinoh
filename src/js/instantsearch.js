document.addEventListener("DOMContentLoaded", function (event) {
    var algoliaConfig = window.eeConfig;

    /** We have nothing to do here if instantsearch is not enabled **/
    if (!algoliaConfig.instant.enabled || !(algoliaConfig.isSearchPage || !algoliaConfig.autocomplete.enabled)) {
        return;
    }

    if ($(algoliaConfig.instant.selector).length <= 0) {
        throw '[Algolia] Invalid instant-search selector: ' + algoliaConfig.instant.selector;
    }
    
    if (algoliaConfig.autocomplete.enabled && $(algoliaConfig.instant.selector).find(algoliaConfig.autocomplete.selector).length > 0) {
        throw '[Algolia] You can\'t have a search input matching "' + algoliaConfig.autocomplete.selector +
        '" inside you instant selector "' + algoliaConfig.instant.selector + '"';
    }

    var findAutocomplete = algoliaConfig.autocomplete.enabled && $(algoliaConfig.instant.selector).find('#algolia-autocomplete-container').length > 0;
    if (findAutocomplete) {
        $(algoliaConfig.instant.selector).find('#algolia-autocomplete-container').remove();
    }

    /**
     * Setup wrapper
     *
     * For templating is used Hogan library
     * Docs: http://twitter.github.io/hogan.js/
     **/
    var wrapperTemplate = Hogan.compile($('#instant_wrapper_template').html());
    var instantSelector = !algoliaConfig.autocomplete.enabled ? algoliaConfig.autocomplete.selector : "#instant-search-bar";
    console.log(instantSelector);
    
    var div = document.createElement('div');
    $(div).addClass('algolia-instant-results-wrapper');
    
    $(algoliaConfig.instant.selector).addClass('algolia-instant-replaced-content');
    $(algoliaConfig.instant.selector).wrap(div);
    
    $('.algolia-instant-results-wrapper').append('<div class="algolia-instant-selector-results"></div>');
    $('.algolia-instant-selector-results').html(wrapperTemplate.render({
        second_bar: algoliaConfig.autocomplete.enabled,
        findAutocomplete: findAutocomplete,
        config: algoliaConfig.instant,
        translations: algoliaConfig.translations
    })).show();


    /**
     * Initialise instant search
     * For rendering instant search page is used Algolia's instantsearch.js library
     * Docs: https://community.algolia.com/instantsearch.js/documentation/
     **/
    var search = instantsearch({
        appId: algoliaConfig.applicationId,
        apiKey: algoliaConfig.instant.apiKey,
        indexName: algoliaConfig.indexName,
        urlSync: {
            useHash: true,
            trackedParameters: ['query', 'page', 'attribute:*', 'index']
        }
    });
    
    search.client.addAlgoliaAgent('ExpressionEngine integration (' + algoliaConfig.extensionVersion + ')');
    
    /**
     * Custom widget - this widget is used to refine results for search page or catalog page
     * Docs: https://community.algolia.com/instantsearch.js/documentation/#custom-widgets
     **/
    search.addWidget({
        getConfiguration: function () {
            if (algoliaConfig.request.query.length > 0 && location.hash.length < 1) {
                return {query: algoliaConfig.request.query}
            }
            return {};
        },
        init: function (data) {
            if (algoliaConfig.request.refinementKey.length > 0) {
                data.helper.toggleRefine(algoliaConfig.request.refinementKey, algoliaConfig.request.refinementValue);
            }
        },
        render: function (data) {
            if (!algoliaConfig.isSearchPage) {
                if (data.results.query.length === 0) {
                    $('.algolia-instant-replaced-content').show();
                    $('.algolia-instant-selector-results').hide();
                }
                else {
                    $('.algolia-instant-replaced-content').hide();
                    $('.algolia-instant-selector-results').show();
                }
            }
        }
    });

    /**
    * Search box
    * Docs: https://community.algolia.com/instantsearch.js/documentation/#searchbox
    **/
    search.addWidget(
        instantsearch.widgets.searchBox({
            container: instantSelector,
            placeholder: algoliaConfig.translations.searchFor
        })
    );

    /**
     * Stats
     * Docs: https://community.algolia.com/instantsearch.js/documentation/#stats
     **/
    search.addWidget(
        instantsearch.widgets.stats({
            container: '#algolia-stats',
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
    algoliaConfig.sortingIndices.unshift({
        name: algoliaConfig.indexName,
        label: algoliaConfig.translations.relevance
    });
    
    search.addWidget(
        instantsearch.widgets.sortBySelector({
            container: '#algolia-sorts',
            indices: algoliaConfig.sortingIndices,
            cssClass: 'form-control'
        })
    );
    
    /**
     * Products' hits
     * This widget renders all products into result page
     * Docs: https://community.algolia.com/instantsearch.js/documentation/#hits
     **/
    search.addWidget(
        instantsearch.widgets.hits({
            container: '#instant-search-results-container',
            templates: {
                allItems: $('#instant-hit-template').html()
            },
            transformData: {
                allItems: function (results) {
                    for (var i = 0; i < results.hits.length; i++) {
                        results.hits[i] = transformHit(results.hits[i], algoliaConfig.priceKey);
                        results.hits[i].isAddToCartEnabled = algoliaConfig.instant.isAddToCartEnabled;
                        
                        results.hits[i].algoliaConfig = window.algoliaConfig;
                    }
                    
                    return results;
                }
            },
            hitsPerPage: algoliaConfig.hitsPerPage
        })
    );
    
    /**
     * Custom widget - Suggestions
     * This widget renders suggestion queries which might be interesting for your customer
     * Docs: https://community.algolia.com/instantsearch.js/documentation/#custom-widgets
     **/
    search.addWidget({
        suggestions: [],
        init: function () {
            if (algoliaConfig.showSuggestionsOnNoResultsPage) {
                var $this = this;
                $.each(algoliaConfig.popularQueries.slice(0, Math.min(4, algoliaConfig.popularQueries.length)), function (i, query) {
                    query = $('<div>').html(query).text(); //xss
                    $this.suggestions.push('<a href="' + algoliaConfig.baseUrl + '/catalogsearch/result/?q=' + encodeURIComponent(query) + '">' + query + '</a>');
                });
            }
        },
        render: function (data) {
            var $infosContainer = $('#algolia-right-container').find('.infos');
            
            if (data.results.hits.length === 0) {
                var content = '<div class="no-results">';
                content += '<div><b>' + algoliaConfig.translations.noProducts + ' "' + $("<div>").text(data.results.query).html() + '</b>"</div>';
                content += '<div class="popular-searches">';
                
                if (algoliaConfig.showSuggestionsOnNoResultsPage && this.suggestions.length > 0) {
                    content += '<div>' + algoliaConfig.translations.popularQueries + '</div>' + this.suggestions.join(', ');
                }
                
                content += '</div>';
                content += algoliaConfig.translations.or + ' <a href="' + algoliaConfig.baseUrl + '/catalogsearch/result/?q=__empty__">' + algoliaConfig.translations.seeAll + '</a>';
                
                content += '</div>';
                
                $('#instant-search-results-container').html(content);
                
                $infosContainer.addClass('hidden');
            }
            else {
                $infosContainer.removeClass('hidden');
            }
        }
    });
    
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
    search.addWidget(
        instantsearch.widgets.currentRefinedValues({
            container: '#current-refinements',
            cssClasses: {
                root: 'facet'
            },
            templates: {
                header: '<div class="name">' + algoliaConfig.translations.selectedFilters + '</div>',
                clearAll: algoliaConfig.translations.clearAll,
                item: $('#current-refinements-template').html()
            },
            attributes: attributes,
            onlyListedAttributes: true
        })
    );

    /**
     * Pagination
     * Docs: https://community.algolia.com/instantsearch.js/documentation/#pagination
     **/
    search.addWidget(
        instantsearch.widgets.pagination({
            container: '#instant-search-pagination-container',
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
        
        search.start();
        
        if (algoliaConfig.autocomplete.enabled) {
            $('#search_mini_form').addClass('search-page');
        }
        
        isStarted = true;
    }
    
    /** Initialise searching **/
    startInstantSearch();
});
