const Command = require('../../core/command');

module.exports = class HexToIntCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'hti',
            description: 'Converts hexadecimals to integers',
            usage: '<#hexcode>',
            aliases: ['hex-to-int', 'hextoint'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `hti` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (!ctx.args.get(0)) return ctx.send('Admiral, you\'re missing the `<#hexcode>` argument');

        const hex    = ctx.args.get(0).replace('#', '');
        const parsed = parseInt(hex, 16);

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setDescription(`**#${hex}** -> **${parsed}**`)
                .build()
        );
    }

    /**
     * Parses the hexadecimal to integers
     * @param {string} hex The hexadecimal 
     */
    parse(hex)
    {
        return parseInt(hex, 16);
    }
}