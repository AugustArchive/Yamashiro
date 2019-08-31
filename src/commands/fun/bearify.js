const Command = require('../../core/command');

module.exports = class BearCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'bearify',
            description: 'Adds a bear emoji in an sentence',
            usage: '<text>',
            aliases: ['bear'],
            category: 'Fun'
        });

        this.emoji = '<a:yamaBear:566225310413094922>';
    }

    /**
     * Run the `bearify` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0)) return ctx.send('Admiral, you\'re missing the `text` argument.');
        return ctx.send(`${this.emoji} ${ctx.args.gather(` ${this.emoji} `)} ${this.emoji}`);
    }
};