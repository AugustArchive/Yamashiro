const Command = require('../../core/command');
const { humanize } = require('@yamashiro/modules');

module.exports = class UptimeCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'uptime',
            aliases: ['upfor'],
            description: 'Shows the current OS and bot uptime'
        });
    }

    /**
     * Runs the `uptime` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const os = require('os');

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle('Current Uptime')
                .addField('Bot', this.client.getUptime(), true)
                .addField('Operating System', humanize(os.uptime() / 1000), true)
                .build()
        );
    }
};