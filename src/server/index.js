const express = require('express');
const commands = require('../assets/commands');

/**
 * Builds the webserver
 * @param {import('../core/client')} client The client
 */
module.exports = (client) => {
    const app = express();
    app
        .get('/', (_, res) => res.status(200).json({ success: true, message: 'get out' }))
        .get('/commands', (_, res) => res.status(200).json({ success: true, data: [commands] }))
        .get('/guilds', async(_, res) => {
            const guilds = await client.database.models.guilds.find({}).exec();
            if (guilds.length < 1) res.status(500).json({ success: false, message: 'rip mongodb' });
            res.status(200).json({ success: true, data: guilds });
        })
        .get('/guilds/:id', async(req, res) => {
            const id = req.params['id'];
            if (!id) res.status(500).json({ success: false, message: 'No guild ID was provided.' });
            const data = await client.database.models.guilds.findOne({ id }).exec();
            if (!data || data === null) res.status(500).json({ success: false, message: `No guild by ${id} was provided.` });
            res.status(200).json({ success: true, data });
        })
        .post('/guilds/:id', async(req, res) => {
            if (!req.params.id) res.status(500).json({ success: false, message: 'No ID was provided' });
            if (!req.body) res.status(500).json({ success: false, message: 'No request manifest was provided.' });
            if (!req.headers.authorization) res.status(500).json({ success: false, message: 'No "Authorization" header was provided' });
            if (req.headers.authorization !== process.env.AUGUST) res.status(500).json({ success: false, message: 'Not a valid key.' });
            if (req.body.reddit.enabled !== 'true') res.status(400).json({ success: false, message: 'Invalid form body' });
            
            const guild = client.guilds.get(req.params.id);
            if (!guild.channels.has(req.body.reddit.channelID)) res.status(400).json({ success: false, message: 'Channel doesn\'t exist' });

            client.database.models.guilds.updateOne({ id: req.params['id'] }, {
                $set: {
                    prefix: req.body.prefix !== undefined? process.env.YAMASHIRO_PREFIX: req.body.prefix,
                    'reddit.enabled': (req.body.reddit.enabled === 'true'),
                    'reddit.channelID': req.body.reddit.channelID,
                    'reddit.subreddit': req.body.reddit.subreddit
                }
            });
        })
        .get('/check', async(req, res) => {
            if (!req.query.guildID) res.status(400).json({ success: false, message: 'No guild ID was provided' });
            if (!req.query.userID) res.status(400).json({ success: false, message: 'No user ID was provided' });
            
            const guild = client.guilds.get(req.query.guildID);
            const user = guild.members.get(req.query.userID);

            if (!user.permission.has('manageGuild')) res.status(400).json({ success: false, message: 'Not a guild admin' });
            res.status(200).json({ success: true });
        })
        .listen(4456, () => client.logger.log('info', 'Now listening on port 4456.'));
};