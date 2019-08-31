const Command = require('../../core/command');

module.exports = class IntToHexCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'ith',
            description: 'Converts hexadecimal-related integers',
            usage: '<num>',
            aliases: ['int-to-hex', 'inttohex'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `ith` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (!ctx.args.get(0)) return ctx.send('Admiral, you\'re missing the `<#hexcode>` argument');

        const int    = ctx.args.gather('');
        const parsed = parseInt(int).toString(16);

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setDescription(`**${int}** -> **#${parsed}**`)
                .build()
        );
    }
}