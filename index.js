const algoliasearch = require('algoliasearch');

const APP_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;

const algoliaClient = algoliasearch(APP_ID, API_KEY);

const index = algoliaClient.initIndex('dev_TEST_SDK_JS');

index.setSettings({})