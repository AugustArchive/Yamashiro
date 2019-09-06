const Event = require('../core/event');
const w = require('wumpfetch');

module.exports = class GuildDeletionEvent extends Event
{
    constructor(client)
    {
        super(client, 'guildDelete');
    }

    /**
     * Emits the `guildDelete` event
     * @param {import('eris').Guild} guild The guild that kicked Yamashiro
     */
    async emit(guild)
    {
        this.client.logger.warn(`Left ${guild.name} (${guild.id})`);
        this.client.editStatus('online', {
            name: `${process.env.YAMASHIRO_PREFIX}help | ${this.client.guilds.size.toLocaleString()} Guilds`,
            type: 0
        });
        await this.post();

        this.client.createMessage('529593466729267200', {
            embed: this
                .client
                .getEmbed()
                .setThumbnail(guild.icon? guild.iconURL: null)
                .setDescription(`Left **${guild.name}** (\`${guild.id}\`)`)
                .setFooter(`Now at ${this.client.guilds.size.toLocaleString()} guilds`)
        });

        this
            .client
            .database
            .models
            .guilds
            .findOne({ id: guild.id })
            .remove()
            .exec();
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