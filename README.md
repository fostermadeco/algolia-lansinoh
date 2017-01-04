# Lansinoh Algolia Search for EE

This is repurposing of the Magento search extension for Algolia integration [https://github.com/algolia/algoliasearch-magento-2](https://github.com/algolia/algoliasearch-magento-2_)

It uses:
* [Algolia js search client](https://github.com/algolia/algoliasearch-client-javascript)
* [Algolia's Autocomplete.js](https://github.com/algolia/autocomplete.js) - search bar input with dropdown results.
* [Algolia Instant search](https://community.algolia.com/instantsearch.js/documentation/#introduction) - search page with instant results.
* [Hogan.js](https://github.com/twitter/hogan.js) for templating
* jQuery

## Notes about implementation
The `eeConfig.js` is saved to window.eeAlgoliaConfig. It is not included in the bundle. It needs to be dynamic and will be generated from ee. This exact implementation will probably be altered once it's hooked up to ee.

The eeConfig contains the property indexName: 'magento_lansinoh', the files add a suffix onto this, e.g. '_products'. So indicies need to be names accordingly. Multiple indicies can be searched, they should be added to autocomplete.sections array. Also the autocomplete (search bar) and instant search are toggled via the autocomplete.enabled and instant.enabled & isSearchPage. 

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
