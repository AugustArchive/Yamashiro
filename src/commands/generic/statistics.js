const Command = require('../../core/command');

module.exports = class StatisticsCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'statistics',
            aliases: ['stats', 'botinfo', 'bot', 'info'],
            description: client => `Shows the real statistics of ${client.user.username}`
        });
    }

    /**
     * Run the `statistics` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const stats = this.client.getStats();
        const user  = await this.client.database.getUser(ctx.sender.id);
        const mostUsed = Object.keys(this.client.commandUsage).sort((a, b) => {
            const usages = this.client.commandUsage;
            if (usages[a] < usages[b]) return 1;
            if (usages[a] > usages[b]) return -1;
            return 0;
        })[0];

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(`${this.client.user.username}#${this.client.user.discriminator} | Realtime Statistics`)
                .setDescription(`**Created At**: ${this.client.util.parseDate(this.client.user.createdAt, user.region)}`)
                .addField('Guilds', stats.guilds, true)
                .addField('Users', stats.users, true)
                .addField('Channels', stats.channels, true)
                .addField('Shards [Current/Total]', `${ctx.guild.shard.id}/${stats.shards}`, true)
                .addField('Uptime', stats.uptime, true)
                .addField('Memory Usage', stats.memoryUsage, true)
                .addField('Versions', `Yamashiro: v${stats.versions.yamashiro} **|** Eris: v${stats.versions.eris} **|** Node: ${stats.versions.node}`)
                .addField('OS', `${stats.platform.platform} (${stats.platform.arch})`, true)
                .addField('OS Release', stats.platform.release, true)
                .addField('CPUs', stats.cpu, true)
                .addField('Messages Seen', this.client.messagesSeen.toLocaleString(), true)
                .addField('Commands Executed', this.client.commandsExecution.toLocaleString(), true)
                .addField('Most Used Command', `${process.env.YAMASHIRO_PREFIX}${mostUsed} (${this.client.commandUsage[mostUsed]} executions)`, true)
                .build()
        );
    }
};