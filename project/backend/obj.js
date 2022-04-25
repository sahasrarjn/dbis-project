const env = require('dotenv').config({path: __dirname + '/.env'});
const { Client } = require('pg');
const client = new Client();
client.connect();

module.exports = client;
