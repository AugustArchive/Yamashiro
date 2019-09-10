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
        const msg = await ctx.send(':ping_pong: **| Admiral, why do you want latencies?...**');
        await msg.delete();
        return ctx.send(`:ping_pong: **| REST: \`${Date.now() - started}ms\` | Gateway: \`${ctx.guild.shard.latency}ms\`**`);
    }
};