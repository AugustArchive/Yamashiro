const Command = require('../../core/command');
const wump = require('wumpfetch');

module.exports = class WhyCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'why',
            description: 'Why did you execute this command?',
            aliases: ['wai'],
            category: 'Fun'
        });
    }

    /**
     * Runs the `why` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const res = await wump({
            url: 'https://nekos.life/api/v2/why',
            method: 'GET'
        }).send();
        const data = res.json();

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setDescription(`:thinking: **${data.why}**`)
                .build()
        );
    }
};