const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class PingCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'ping',
            description: 'Gets the latency of Yamashiro',
            aliases: ['pong']
        });
    }

    /**
     * Runs the `ping` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const started = Date.now();
        const m = await ctx.send('Admiral, why do you want latencies?');

        const pings = {
            messageCreation: Date.now() - started,
            messageDeletion: (Date.now() - m.createdAt).toFixed(),
            shard: ctx.guild.shard.latency
        };

        await m.delete();
        return ctx.embed(
            this
                .client
                .getEmbed()
                .setDescription(stripIndents`
                    **Message Creation**: ${pings.messageCreation}ms
                    **Message Deletion**: ${pings.messageDeletion}ms
                    **Shard #${ctx.guild.shard.id}**: ${pings.shard}ms
                `)
                .build()
        );
    }
};