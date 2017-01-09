window.algoliaConfig = {
    applicationId: "7CCC0LXQFA",
    autocomplete: {
        apiKey: "3fdf964632cab487a2619c83e2d95198",
        displaySuggestionsCategories: false,
        enabled: true,
        nbOfCategoriesSuggestions: "1",
        nbOfProductsSuggestions: "3",
        nbOfQueriesSuggestions: "0",
        sections: [
            {
                hitsPerPage: "3",
                label: "Products",
                name: "products",
            },
            {
                hitsPerPage: "3",
                label: "Pages",
                name: "pages"
            }
        ],
        templates: {},
        selector: ".algolia-autocomplete-input",
    },
    autofocus: true,
    baseUrl: "http://lansinohdev.brandshop.com",
    currencyCode: "USD",
    currencySymbol: "$",
    extensionVersion: "0.0.1",
    hitsPerPage: 6,
    indexName: "lansinoh",
    instant: {
        apiKey:"3fdf964632cab487a2619c83e2d95198",
        content: "",
        description: "",
        enabled: true,
        hasFacets: false,
        imgHtml: "",
        isAddToCartEnabled: false,
        selector: ".algolia-search-instant-selector",
        title: "",
        sections: [
            {
                label: "Products",
                name: "products",
            },
            {
                label: "Pages",
                name: "pages"
            }
        ]
    },
    facets: [
        {
            attribute: "categories",
            label: "Products"
        }
    ],
    isCategoryPage: false,
    isSearchPage: true,
    maxValuesPerFacet: 10,
    popularQueries: [],
    priceKey: ".USD.default",
    removeBranding: false,
    request: {
        formKey: "yfNTPMqj7ULqoIxc",
        path: "",
        query: "",
        refinementKey: "",
        refinementValue: "",
    },
    showCatsNotIncludedInNavigation: false,
    showSuggestionsOnNoResultsPage: true,
    sortingIndices: [],
    translations: {
        allDepartments: "All departments",
        categories: "Categories",
        clearAll: "Clear all",
        go: "Go",
        in: "in",
        nextPage: "Next page",
        noProducts: "No results for query",
        noResults: "No results",
        or: "or",
        orIn: "or in",
        popularQueries: "You can try one of the popular search queries",
        previousPage: "Previous page",
        products: "Products",
        refine: "Refine",
        relevance: "Relevance",
        searchBy: "Search by",
        searchFor: "Search for products",
        seeAll: "See all products",
        seeIn: "See products in",
        selectedFilters: "Selected Filters",
        to: "to"
    },
    urls: {
        logo: "http://lansinohdev.brandshop.com/skin/frontend/lansinoh/default/algoliasearch/algolia-logo.png"
    }
}