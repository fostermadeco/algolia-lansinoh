# Lansinoh Algolia Search for EE

This is repurposing of the Magento search extension for Algolia integration [https://github.com/algolia/algoliasearch-magento-2](https://github.com/algolia/algoliasearch-magento-2)

It uses:
* [Algolia js search client](https://github.com/algolia/algoliasearch-client-javascript)
* [Algolia's Autocomplete.js](https://github.com/algolia/autocomplete.js) - search bar input with dropdown results.
* [Algolia Instant search](https://community.algolia.com/instantsearch.js/documentation/#introduction) - search page with instant results.
* [Hogan.js](https://github.com/twitter/hogan.js) for templating
* jQuery

## Files
* css - /src/css/algoliaSearch.css
* templates - inline in /src/js/index.html
* html - 
* js (prod) - /dist/algoliaSearch.bundle.js
* js (dev) - /assets/algoliaSearch.bundle.js (has debug on so autocomplete stays open)
* html:

For autocomplete:
```
<!-- html for algolia autcomplete search (search bar) -->
<form id="search_mini_form" action="#" method="get">
    <div class="form-search">
        <input id="keywords" type="text" name="q" class="input-text algolia-autocomplete-input" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="off" placeholder="Search">
        <button type="submit" title="Search" class="button"><span><span>Search</span></span></button>
        <span class="clear-cross clear-query-autocomplete"></span>
        <span id="algolia-glass" class="magnifying-glass" width="24" height="24"></span>
    </div>
    <div id="algolia-search-autocomplete-container"></div>
</form>
```

For instant search results page:
```
<!-- html for algolia results page search -->
<div class="algolia-search-instant-selector">
    <div id="algolia-search-instant-container"></div>
</div>
```

## Notes about implementation
The `algoliaConfig.js` is saved to window.algoliaConfig. It is not included in the bundle. It needs to be dynamic and will be generated from ee. This exact implementation will probably be altered once it's hooked up to ee.

The algoliaConfig contains the property indexName: 'lansinoh', the files add a suffix onto this, e.g. '\_products' So indicies need to be names accordingly. Multiple indicies can be searched. For the autocomplete search they should be added to autocomplete.sections array. For the instant search, it is setup to look for '\_products' and '\_pages' indicies. 

## Templates

Templates were moved to be all inline in html to make them easier to edit. Notes on the additional setup are below, but not necessary.

Some templates are moustache. Those are compiled into one file. Hogan has a non-documented script that will compile the template:

```
node_modules/hogan.js/bin/hulk src/templates/*.hogan >> src/templates.temp.js
```

Copy this templates array output items into the src/templates.js file. This copying is necessary so the import wrapper is intact so the templates can be imported. I'm sure this process could be automated if there was active development. The html page does still contain some script templates which are not moustache templates, but referred to in the js via jquery and selectors. That could probably be normalized as well if necessary.

## Build
This project uses Webpack to manage dependencies and bundle code.

Get all the dependencies:
```
npm install
```

Run webpack server to watch js and bundle:
```
npm run watch
```

Create production ready bundle:
```
npm run dist
```

