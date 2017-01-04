(function() {
    var eeConfig = {
        applicationID: '7CCC0LXQFA',
        apiKey: '3fdf964632cab487a2619c83e2d95198',
        indicies: [
            {
                name: 'magento_lansinoh_products', 
                headerText: 'Products',
                displayKey: 'name',
                suggestionTemplate: function(suggestion) {
                    return `<img src="${suggestion.thumbnail_url}" />
                    ${suggestion.price.USD.default_formated}
                    <span>
                        ${suggestion._highlightResult.name.value}
                    </span> in ${suggestion.categories.level0.join(', ')}`;
                }
            },
            {
                name: 'magento_lansinoh_pages',
                headerText: 'Pages',
                displayKey: 'name',
                suggestionTemplate: function(suggestion) {
                    return `<span>
                        ${suggestion._highlightResult.name.value}
                    </span>`;
                }
            }
        ],
        inputPlaceholder: 'Search...'
    }

    var selector = '#aa-search-input';

    var input = document.querySelector(selector);
    input.setAttribute('placeholder', eeConfig.inputPlaceholder || 'Search')

    var client = algoliasearch(eeConfig.applicationID, eeConfig.apiKey, {protocol: 'https:'});

    function initIndicies(client, indexNames) {
        return indexNames.map(function(indexName) {
            return client.initIndex(indexName);
        });
    }

    function addEEConfig(indicies, eeConfigs) {
        indicies.map((index, i) => {
            index.eeConfig = eeConfig.indicies[i]
        });
    }

    function getIndexConfig(index, autocomplete) {
        console.log(index);
        index.getSettings(function(err, content) {
            console.log(content);
        });
        return { 
            source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
            //value to be displayed in input control after user's suggestion selection 
            displayKey: index.eeConfig.displayKey,
            //hash of templates used when rendering dataset
            templates: { 
                header: `<div class="aa-suggestions-category">${index.eeConfig.headerText}</div>`,
                //'suggestion' templating function used to render a single suggestion
                suggestion: function(suggestion) {
                    console.log(suggestion);
                    return index.eeConfig.suggestionTemplate(suggestion);
                }
            }
        };
    }

    function getIndexConfigs(indicies, autocomplete) {
        return indicies.map(function(index) {
            return getIndexConfig(index, autocomplete);
        });
    }

    var indexNames = eeConfig.indicies.map(index => index.name);
    var indicies = initIndicies(client, indexNames);
    addEEConfig(indicies, eeConfig.indicies);
    var indexConfigs = getIndexConfigs(indicies, autocomplete);
    console.log(indexConfigs);
    autocomplete(selector, { hint: false }, indexConfigs);
})();
