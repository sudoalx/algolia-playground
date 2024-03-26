require('dotenv').config();
const algoliasearch = require('algoliasearch');
const { Client } = require('pg')
const _ = require('lodash')

const initConfig = async () => {
    const APP_ID = process.env.APP_ID;
    const API_KEY = process.env.API_KEY;

    const algoliaClient = algoliasearch(APP_ID, API_KEY);

    const index = algoliaClient.initIndex('dev_PRODUCTS');
    await index.setSettings({
        hitsPerPage: 10,
    });
}

// Save from db
const saveFromDB = async () => {

    const pgConfig = {
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    };
    const pgClient = new Client(pgConfig);
    await pgClient.connect();

    const queryResult = await pgClient.query('SELECT * FROM EMPLOYEE_small');
    const chunks = _.chunk(queryResult.rows, 100);
    chunks.forEach(async (chunk) => {
        await index.saveObjects(chunk, { autoGenerateObjectIDIfNotExist: true });
    })


    pgClient.end()
}

// Save using from db using chunks
const saveUsingChunks = async () => {
    const pgConfig = {
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    };
    const pgClient = new Client(pgConfig);
    await pgClient.connect();

    const queryResult = await pgClient.query('SELECT * FROM EMPLOYEE');
    const chunks = _.chunk(queryResult.rows, 100);
    chunks.forEach(async (chunk) => {
        await index.saveObjects(chunk, { autoGenerateObjectIDIfNotExist: true });
    })

    pgClient.end()
}

// Save one entry object
const saveOneEntry = async () => {
    const entry = {
        "id": 2,
        "firstName": "Rhoda",
        "lastName": "Trevarthen",
        "email": "rtrevarthen1@google.co.jp",
        "gender": "Male",
        "ipAddress": "130.62.87.233",
        "company": "Tagfeed",
        "salaryCurrency": "BRL",
        "salary": 9908.96
    }
    const result = await index.saveObject(entry, {
        autoGenerateObjectIDIfNotExist: true
    });
    console.log(result);
}

// Save multiple entries from a json file
const saveMultipleEntries = async () => {
    const products = require('./data/products.json')
    const result = await index.saveObjects(products, {
        autoGenerateObjectIDIfNotExist: true
    });
    console.log(result);
}

// Save multiple entries with chunks from a json file
const saveMultipleEntriesWithChunks = async () => {
    const products = require('./data/products.json')
    const chunks = _.chunk(products, 100);
    chunks.forEach(async (chunk) => {
        await index.saveObjects(chunk, { autoGenerateObjectIDIfNotExist: true });
    })
}

const main = async () => {
    initConfig().catch(console.error);
}

main();