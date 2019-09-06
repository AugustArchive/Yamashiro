console.clear();
require('dotenv').config({ path: '../.env' });

const YamashiroClient = require('./core/client');
const Constants = require('./util/constants');
const w = require('wumpfetch');

const client = new YamashiroClient();

w.setDefaults({
    headers: {
        'User-Agent': Constants.USER_AGENT
    }
});

client.build();

process.on('unhandledRejection', (reason) => {
    const { stripIndents } = require('common-tags');
    client.logger.log('error', stripIndents`
        An unhandled promise reject occured:
        ${require('util').inspect(reason)}
    `);
});