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
        return ctx.send(`:information_source: **| ${humanize(Date.now() - this.client.startTime)}**`);
    }
};
