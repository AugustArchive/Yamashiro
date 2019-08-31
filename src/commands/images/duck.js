const Command = require('../../core/command');
const w = require('wumpfetch');

module.exports = class DuckCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'duck',
            description: ':duck: Grabs an random cute duck!!',
            aliases: ['duk'],
            category: 'Images'
        });
    }

    /**
     * Run the `duck` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const res = await w({
            url: 'https://random-d.uk/api/v1/random',
            method: 'GET'
        }).send();
        const data = res.json();

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(':duck: Quack! :duck:')
                .setURL(data.url)
                .setImage(data.url)
                .build()
        );
    }
}