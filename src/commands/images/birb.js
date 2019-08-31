const Command = require('../../core/command');
const w = require('wumpfetch');

module.exports = class BirdCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'birb',
            description: ':bird: Sends a image of a bird!',
            aliases: ['birb'],
            category: 'Images',
            disabled: true
        });
    }

    /**
     * Runs the `birb` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const res = await w({
            url: 'http://random.birb.pw/tweet',
            method: 'GET'
        }).send();
        const data = res.text();
        const url = `http://random.birb.pw/img/${data}`;

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(':bird: Tweet! :bird:')
                .setURL(url)
                .setImage(url)
                .build()
        );
    }
};