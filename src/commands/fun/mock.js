const Command = require('../../core/command');

module.exports = class MockCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'mock',
            description: 'SeNdS TeXt lIkE ThIs',
            usage: '<text>',
            aliases: ['bigtext'],
            category: 'Fun'
        });
    }

    /**
     * Runs the `mock` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0)) return ctx.send('Admiral, you\'re missing the `text` argument!');

        const str = ctx.args.args.slice(0).join(' ');
        const mock = str.toString().split('').map((a, b) => b % 2? a.toLowerCase(): a.toUpperCase()).join('');
        return ctx.send(mock);
    }
};