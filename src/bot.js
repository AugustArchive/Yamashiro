console.clear();
require('dotenv').config({ path: '../.env' });
require('wumpfetch').userAgent = `Yamashiro/DiscordBot (v${require('../package').version})`;

const YamashiroClient = require('./core/client');
const client = new YamashiroClient();

client.build();

process.on('unhandledRejection', (reason) => {
    const { stripIndents } = require('common-tags');
    client.logger.error(stripIndents`
        An unhandled promise reject occured:
        ${require('util').inspect(reason)}
    `);
});