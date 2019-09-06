const Event = require('../core/event');
const w     = require('wumpfetch');

module.exports = class ReadyEvent extends Event
{
    constructor(client)
    {
        super(client, 'ready');
    }

    /**
     * Emits the `ready` event
     */
    async emit()
    {
        this.client.logger.info(`Yamashiro has connected to Discord with ${this.client.guilds.size} Guild${this.client.guilds.size > 1? 's': ''} and ${this.client.users.size} Users`);
        this.client.editStatus('online', {
            name: `${process.env.YAMASHIRO_PREFIX}help | ${this.client.guilds.size.toLocaleString()} Guilds`,
            type: 0
        });
        this.client.startRedditFeeds();
        await this.post();
        setTimeout(async() => await this.post(), 900000);
    }

    /**
     * Posts to all bot lists
     */
    async post()
    {
        // not Yamashiro, it's Fusou
        if (this.client.user.id === '508842721545289731') return;

        // discord.boats
        await w({
            url: `https://discord.boats/api/bot/${this.client.user.id}`,
            method: 'POST',
            headers: {
                Authorization: process.env.UNTO
            },
            data: {
                server_count: this.client.guilds.size
            }
        }).send().then(r => console.log(`Received ${r.statusCode} at discord.boats`));

        // discordbots.org
        await w({
            url: `https://discordbots.org/api/bots/${this.client.user.id}/stats`,
            method: 'POST',
            headers: {
                Authorization: process.env.OLIY
            },
            data: {
                server_count: this.client.guilds.size,
                shard_count: this.client.shards.size
            }
        }).send().then(r => console.log(`Received ${r.statusCode} at discordbots.org`));

        // mythicalbots.xyz
        await w({
            url: `https://mythicalbots.xyz/api/bot/${this.client.user.id}`,
            method: 'POST',
            headers: {
                Authorization: process.env.MYTHICAL
            },
            data: {
                server_count: this.client.guilds.size
            }
        }).send().then(r => console.log(`Received ${r.statusCode} at mythicalbots.xyz!`));

        // api.augu.dev
        const stats = this.client.getStats();
        const mostUsed = Object.keys(this.client.commandUsage).sort((a, b) => {
            const usages = this.client.commandUsage;
            if (usages[a] < usages[b]) return 1;
            if (usages[a] > usages[b]) return -1;
            return 0;
        })[0];

        await w({
            url: 'https://api.augu.dev/yamashiro/stats',
            method: 'POST',
            headers: {
                Authorization: process.env.AUGUST
            },
            data: {
                guilds: stats.guilds,
                users: stats.users,
                channels: stats.channels,
                shards: stats.shards,
                uptime: stats.uptime,
                memory_usage: stats.memoryUsage,
                commands_executed: this.client.commandsExecution,
                messages_seen: this.client.messagesSeen,
                most_used_command: mostUsed
            }
        }).send().then(r => console.log(`Received ${r.statusCode} at api.augu.dev!`));
    }
};