const Command = require('../../core/command');
const w = require('wumpfetch');

module.exports = class CatCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'cat',
            description: ':cat: Grabs an random kitty!!',
            aliases: ['kitty'],
            category: 'Images'
        });
    }

    /**
     * Runs the `cat` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const res = await w({
            url: 'https://nekos.life/api/v2/img/meow',
            method: 'GET'
        }).send();
        const data = res.json();

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(':cat: Meow!! :cat:')
                .setURL(data.url)
                .setImage(data.url)
                .build()
        );
    }
};