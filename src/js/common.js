import $ from 'jquery';
import autocomplete from 'autocomplete.js';

module.exports = function() {
    var algoliaConfig = window.algoliaConfig;

    return {
        transformHit,
        getAutocompleteSource,
        getIndexName,
        fixAutocompleteCssHeight,
        fixAutocompleteCssSticky,
        handleInputCrossAutocomplete,
        focusInstantSearchBar,
        handleInputCrossInstant,
        getQueryFromLocation,
        misc
    };

    function transformHit(hit, price_key) {
        if (Array.isArray(hit.categories)) {
            hit.categories = hit.categories.join(', ');
        }

        if (hit._highlightResult.categories_without_path && Array.isArray(hit.categories_without_path)) {
            hit.categories_without_path = $.map(hit._highlightResult.categories_without_path, function (category) {
                return category.value;
            });

            hit.categories_without_path = hit.categories_without_path.join(', ');
        }

        if (Array.isArray(hit.color)) {
            var colors = [];

            $.each(hit._highlightResult.color, function (i, color) {
                if (color.matchLevel === 'none') {
                    return;
                }

                colors.push(color.value);
            });

            colors = colors.join(', ');

            hit._highlightResult.color = {value: colors};
        }
        else if (hit._highlightResult.color && hit._highlightResult.color.matchLevel === 'none') {
            hit._highlightResult.color = {value: ''};
        }

        if (hit._highlightResult.color && hit._highlightResult.color.value && hit.categories_without_path) {
            if (hit.categories_without_path.indexOf('<em>') === -1 && hit._highlightResult.color.value.indexOf('<em>') !== -1) {
                hit.categories_without_path = '';
            }
        }


        if (Array.isArray(hit._highlightResult.name)) {
            hit._highlightResult.name = hit._highlightResult.name[0];
        }

        if (Array.isArray(hit.price)) {
            hit.price = hit.price[0];
        }

        if (hit['price'] !== undefined && price_key !== '.' + algoliaConfig.currencyCode + '.default' && hit['price'][algoliaConfig.currencyCode][price_key.substr(1) + '_formated'] !== hit['price'][algoliaConfig.currencyCode]['default_formated']) {
            hit['price'][algoliaConfig.currencyCode][price_key.substr(1) + '_original_formated'] = hit['price'][algoliaConfig.currencyCode]['default_formated'];
        }

        return hit;
    };

    function getAutocompleteSource(section, algolia_client, $, i) {
        if (section.hitsPerPage <= 0) {
            return null;
        }

        var options = {
            hitsPerPage: section.hitsPerPage,
            analyticsTags: 'autocomplete'
        };

        var source;

        if (section.name === "products") {
            options.facets = ['categories.level0'];
            // options.numericFilters = 'visibility_search=1';

            source = {
                source: autocomplete.sources.hits(algolia_client.initIndex(getIndexName(section.name)), options),
                name: section.name,
                templates: {
                    empty: function (query) {
                        var template = '<div class="aa-no-results-products">' +
                            '<div class="title">' + algoliaConfig.translations.noProducts + ' "' + $("<div>").text(query.query).html() + '"</div>';

                        var suggestions = [];

                        if (algoliaConfig.showSuggestionsOnNoResultsPage && algoliaConfig.popularQueries.length > 0) {
                            $.each(algoliaConfig.popularQueries.slice(0, Math.min(3, algoliaConfig.popularQueries.length)), function (i, query) {
                                query = $('<div>').html(query).text(); // Avoid xss
                                var link = '<a href="' + algoliaConfig.baseUrl + '/search/#q=' + encodeURIComponent(query) + '">' + query + '</a>';
                                suggestions.push(link);
                            });

                            template += '<div class="suggestions"><div>' + algoliaConfig.translations.popularQueries + '</div>';
                            template += '<div>' + suggestions.join(', ') + '</div>';
                            template += '</div>';
                        }

                        template += '<div class="see-all">' + (suggestions.length > 0 ? algoliaConfig.translations.or + ' ' : '') + '<a href="' + algoliaConfig.baseUrl + '/search/#q=__empty__">' + algoliaConfig.translations.seeAll + '</a></div>' +
                            '</div>';

                        return template;
                    },
                    suggestion: function (hit) {
                        hit = transformHit(hit, algoliaConfig.priceKey)
                        hit.displayKey = hit.displayKey || hit.name;

                        return algoliaConfig.autocomplete.templates[section.name].render(hit);
                    }
                }
            };
        }
        else if (section.name === "categories" || section.name === "pages") {
            if (section.name === "categories" && algoliaConfig.showCatsNotIncludedInNavigation == false) {
                options.numericFilters = 'include_in_menu=1';
            }

            source = {
                source: autocomplete.sources.hits(algolia_client.initIndex(getIndexName(section.name)), options),
                name: i,
                templates: {
                    empty: '<div class="aa-no-results">' + algoliaConfig.translations.noResults + '</div>',
                    suggestion: function (hit) {
                        if (section.name === 'categories') {
                            hit.displayKey = hit.path;
                        }

                        if (hit._snippetResult && hit._snippetResult.content && hit._snippetResult.content.value.length > 0) {
                            hit.content = hit._snippetResult.content.value;

                            if (hit.content.charAt(0).toUpperCase() !== hit.content.charAt(0)) {
                                hit.content = '&#8230; ' + hit.content;
                            }

                            if ($.inArray(hit.content.charAt(hit.content.length - 1), ['.', '!', '?'])) {
                                hit.content = hit.content + ' &#8230;';
                            }

                            if (hit.content.indexOf('<em>') === -1) {
                                hit.content = '';
                            }
                        }

                        hit.displayKey = hit.displayKey || hit.name;

                        return algoliaConfig.autocomplete.templates[section.name].render(hit);
                    }
                }
            };
        }
        else if (section.name === "suggestions") {
            /** Popular queries/suggestions **/
            var suggestions_index = algolia_client.initIndex(common.getIndexName('suggestions')),
                products_index = algolia_client.initIndex(common.getIndexName('products')),
                suggestionsSource;
            
            if (algoliaConfig.autocomplete.displaySuggestionsCategories == true) {
                suggestionsSource = autocomplete.sources.popularIn(suggestions_index, {
                    hitsPerPage: section.hitsPerPage
                    }, {
                        source: 'query',
                        index: products_index,
                        facets: ['categories.level0'],
                        hitsPerPage: 0,
                        typoTolerance: false,
                        maxValuesPerFacet: 1,
                        analytics: false
                    }, {
                        includeAll: true,
                        allTitle: algoliaConfig.translations.allDepartments
                    });
            } else {
                suggestionsSource = autocomplete.sources.hits(suggestions_index, {
                    hitsPerPage: section.hitsPerPage
                });
            }

            source = {
                source: suggestionsSource,
                displayKey: 'query',
                name: section.name,
                templates: {
                    suggestion: function (hit) {
                        if (hit.facet) {
                            hit.category = hit.facet.value;
                        }
                        hit.url = getSearchUrl(hit.facet);
                        return algoliaConfig.autocomplete.templates.suggestions.render(hit);
                    }
                }
            };
        } else {
            /** Additional sections **/
            var index = algolia_client.initIndex(getIndexName('section'));

            source = {
                source: autocomplete.sources.hits(index, {
                    hitsPerPage: section.hitsPerPage,
                    analyticsTags: 'autocomplete'
                }),
                displayKey: 'value',
                name: i,
                templates: {
                    suggestion: function (hit) {
                        hit.url = algoliaConfig.baseUrl + '/search/#q=' + encodeURIComponent(hit.value) + '&refinement_key=' + section.name;
                        return algoliaConfig.autocomplete.templates.additionnalSection.render(hit);
                    }
                }
            };
        }

        if (section.name === 'products') {
            source.templates.footer = function (query, content) {
                var keys = [];
                for (var key in content.facets['categories.level0']) {
                    var url = algoliaConfig.baseUrl + '/search/#q=' + encodeURIComponent(query.query) + '&hFR[categories.level0][0]=' + encodeURIComponent(key) + '&idx=' + algoliaConfig.indexName + '_products';
                    keys.push({
                        key: key,
                        value: content.facets['categories.level0'][key],
                        url: url
                    });
                }

                keys.sort(function (a, b) {
                    return b.value - a.value;
                });

                var ors = '';

                if (keys.length > 0) {
                    ors += '<span><a href="' + keys[0].url + '">' + keys[0].key + '</a></span>';
                }

                if (keys.length > 1) {
                    ors += ', <span><a href="' + keys[1].url + '">' + keys[1].key + '</a></span>';
                }

                var allUrl = algoliaConfig.baseUrl + '/search/#q=' + encodeURIComponent(query.query);
                var returnFooter = '<div id="autocomplete-products-footer">' + algoliaConfig.translations.seeIn + ' <span><a href="' + allUrl + '">' + algoliaConfig.translations.allDepartments + '</a></span> (' + content.nbHits + ')';

                if (ors && algoliaConfig.instant.enabled) {
                    returnFooter += ' ' + algoliaConfig.translations.orIn + ' ' + ors;
                }

                returnFooter += '</div>';

                return returnFooter;
            }
        }

        if (section.name !== 'suggestions' && section.name !== 'products') {
            source.templates.header = '<div class="category">' + (section.label ? section.label : section.name) + '</div>';
        }

        return source;
    };

    function getIndexName(section) {
        const pathArray = window.location.pathname.split( '/' );
        // language is only used for ee content, e.g. lansinoh_pages_en and lansinoh_pages_eg
        const language = (pathArray[1] === 'en' || pathArray[1] === 'es') ? pathArray[1] : 'en';
        // magento specific indicies have magento prefix, e.g. lansinoh_magento_lansinoh_products
        console.log(algoliaConfig.indexName + '_' + language + '_' + section);
        return algoliaConfig.indexName + '_' + language + '_' + section;
    }

    function getSearchUrl(facet) {
        if (facet && facet.value !== 'All departments') {
            return algoliaConfig.baseUrl + '/search/#q=' + hit.query + '&hFR[categories.level0][0]=' + encodeURIComponent(hit.category) + '&idx=' + getIndexName('products');
        } else {
            return algoliaConfig.baseUrl + '/search/#q=' + hit.query;
        }
    }

    function fixAutocompleteCssHeight() {
        if ($(document).width() > 768) {
            var $otherSections = $('.other-sections'),
                $dataSetProducts = $('.aa-dataset-products');

            $otherSections.css('min-height', '0');
            $dataSetProducts.css('min-height', '0');

            var height = Math.max($otherSections.outerHeight(), $dataSetProducts.outerHeight());
            $dataSetProducts.css('min-height', height);
        }
    }    

    function fixAutocompleteCssSticky(menu) {
        var dropdown_menu = $('#algolia-autocomplete-container .aa-dropdown-menu');
        var autocomplete_container = $('#algolia-autocomplete-container');
        autocomplete_container.removeClass('reverse');

        /** Reset computation **/
        dropdown_menu.css('top', '0px');

        /** Stick menu vertically to the input **/
        var targetOffset = Math.round(menu.offset().top + menu.outerHeight());
        var currentOffset = Math.round(autocomplete_container.offset().top);

        dropdown_menu.css('top', (targetOffset - currentOffset) + 'px');

        if (menu.offset().left + menu.outerWidth() / 2 > $(document).width() / 2) {
            /** Stick menu horizontally align on right to the input **/
            dropdown_menu.css('right', '0px');
            dropdown_menu.css('left', 'auto');

            targetOffset = Math.round(menu.offset().left + menu.outerWidth());
            currentOffset = Math.round(autocomplete_container.offset().left + autocomplete_container.outerWidth());

            dropdown_menu.css('right', (currentOffset - targetOffset) + 'px');
        }
        else {
            /** Stick menu horizontally align on left to the input **/
            dropdown_menu.css('left', 'auto');
            dropdown_menu.css('right', '0px');
            autocomplete_container.addClass('reverse');

            targetOffset = Math.round(menu.offset().left);
            currentOffset = Math.round(autocomplete_container.offset().left);

            dropdown_menu.css('left', (targetOffset - currentOffset) + 'px');
        }
    }

    function handleInputCrossAutocomplete(input) {
        if (input.val().length > 0) {
            input.closest('#algolia-searchbox').find('.clear-query-autocomplete').show();
            input.closest('#algolia-searchbox').find('.magnifying-glass').hide();
        }
        else {
            input.closest('#algolia-searchbox').find('.clear-query-autocomplete').hide();
            input.closest('#algolia-searchbox').find('.magnifying-glass').show();
        }
    }

    function focusInstantSearchBar (search, instant_search_bar) {
        if ($(window).width() > 992) {
            instant_search_bar.focusWithoutScrolling();
            if (algoliaConfig.autofocus === false) {
                instant_search_bar.focus().val('');
            }
        }
        instant_search_bar.val(search.helper.state.query);
    };

    function handleInputCrossInstant (input) {
        if (input.val().length > 0) {
            input.closest('#instant-search-box').find('.clear-query-instant').show();
        }
        else {
            input.closest('#instant-search-box').find('.clear-query-instant').hide();
        }
    };

    function getQueryFromLocation() {
        var firstParts = location.href.split("?");
        if (firstParts.length >= 1) return '';
        var params = firstParts[1].split("&");
        return params[0].split("=")[1];
    }

    function misc() {
        $(algoliaConfig.autocomplete.selector).each(function () {
            $(this).closest('form').submit(function (e) {
                var query = $(this).find(algoliaConfig.autocomplete.selector).val();

                if (algoliaConfig.instant.enabled && query == '')
                    query = '__empty__';

                window.location = $(this).attr('action') + '?q=' + query;

                return false;
            });
        });

        var instant_selector = !algoliaConfig.autocomplete.enabled ? ".algolia-search-input" : "#instant-search-bar";

        $(document).on('input', algoliaConfig.autocomplete.selector, function () {
            handleInputCrossAutocomplete($(this));
        });

        $(document).on('input', instant_selector, function () {
            handleInputCrossInstant($(this));
        });

        $(document).on('click', '.clear-query-instant', function () {
            var input = $(this).closest('#instant-search-box').find('input');
            input.val('');
            input.get(0).dispatchEvent(new Event('input'));
            handleInputCrossInstant(input);
        });

        $(document).on('click', '.clear-query-autocomplete', function () {
            var input = $(this).closest('#algolia-searchbox').find('input');
            input.val('');

            if (!algoliaConfig.autocomplete.enabled && algoliaConfig.instant.enabled) {
                input.get(0).dispatchEvent(new Event('input'));
            }

            handleInputCrossAutocomplete(input);
        });

        /** Handle small screen **/
        $('body').on('click', '#refine-toggle', function () {
            $('#instant-search-facets-container').toggleClass('hidden-sm').toggleClass('hidden-xs');
            if ($(this).html()[0] === '+')
                $(this).html('- ' + algoliaConfig.translations.refine);
            else
                $(this).html('+ ' + algoliaConfig.translations.refine);
        });

        $.fn.focusWithoutScrolling = function () {
            var x = window.scrollX, y = window.scrollY;
            this.focus();
            window.scrollTo(x, y);
        };
        
    }

};