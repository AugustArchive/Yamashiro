const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class ShardInformationCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'shardinfo',
            aliases: ['shard', 'shards'],
            description: 'Shows the shard information',
            usage: '<shardID>',
            guildOnly: true
        });
    }

    /**
     * Runs the `shardinfo` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0))
        {
            let shardMap = '';
            this.client.shards.map((shard) => shardMap += `${shard.status === 'disconnected'? '-': '+'} ${shard.id === ctx.guild.shard.id? `Shard #${shard.id} (current): `: `Shard #${shard.id}: `}${shard.latency}ms`);
            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle('Shard Information')
                    .setDescription(stripIndents`
                        \`\`\`diff
                        ${shardMap}
                        \`\`\`
                    `)
                    .build()
            );
        }

        const arg = ctx.args.get(0);
        const shard = this.client.shards.filter((sh) => sh.id === Number(arg));

        if (shard.length > 0)
        {
            const sh = shard[0];
            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle(`Shard #${sh.id}`)
                    .addField('Latency', `${sh.latency}ms`, true)
                    .addField('Status', this.determineStatus(sh.status), true)
                    .build()
            );
        } else return ctx.send(`Admiral, I couldn't find the shard id \`${arg}\`...`);
    }

    /**
     * Determines the shard status
     * @param {string} status The status
     */
    determineStatus(status)
    {
        return status === 'disconnected'? "Disconnected": status === 'connecting'? "Connecting to Discord": status === 'handshaking'? "Connection Handshaking": status === 'ready'? "Connected": "Unknown";
    }
};