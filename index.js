require('dotenv').config();
const algoliasearch = require('algoliasearch');
const { Client } = require('pg')
const _ = require('lodash')

const APP_ID = process.env.APP_ID;
const API_KEY = process.env.API_KEY;

const algoliaClient = algoliasearch(APP_ID, API_KEY);
const pgClient = new Client({ database: 'postgres' });

const index = algoliaClient.initIndex('dev_EMPLOYEES');


// Save from db
const saveFromDB = async () => {

    const pgConfig = {
        user: 'postgres',
        password: 'postgres',
        // database: 'postgres'
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
    };
    const pgClient = new Client(pgConfig);
    await pgClient.connect();

    const queryResult = await pgClient.query('SELECT * FROM EMPLOYEE');
    const result = await index.saveObjects(queryResult.rows, { autoGenerateObjectIDIfNotExist: true });
    console.log(result);

    pgClient.end()
}

// Save one employee object
const saveOneEmployee = async () => {
    const employee = {
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
    const result = await index.saveObject(employee, {
        autoGenerateObjectIDIfNotExist: true
    });
    console.log(result);
}

// Save multiple employees from a json file
const saveMultipleEmployees = async () => {
    const employees = require('./employees.json')
    const result = await index.saveObjects(employees, {
        autoGenerateObjectIDIfNotExist: true
    });
    console.log(result);
}

// saveOneEmployee().catch(console.error);
// saveMultipleEmployees().catch(console.error);
// saveFromDB().catch(console.error);
saveUsingChunks().catch(console.error);