const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'bolt://127.0.0.1:7687',
    neo4j.auth.basic('neo4j', 'password')
);

const session = driver.session();

module.exports = { driver, session };