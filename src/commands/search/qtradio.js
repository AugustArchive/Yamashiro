const Command = require('../../core/command');
const w       = require('wumpfetch');

module.exports = class QtRadioCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'qtradio',
            description: 'Shows the current song playing on qtradio.moe',
            aliases: ['qt-np'],
            category: 'Search'
        });
    }
    
    /**
     * Runs the `qtradio` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const result = await w({
            url: 'https://qtradio.moe/stats',
            method: 'GET'
        }).send();
        const data = result.json();

        const body = data? data.icestats.source[0]: data.icestats.source;
        return ctx.send(`:musical_note: **${body.artist} - ${body.title}**`);
    }
}