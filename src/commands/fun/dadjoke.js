const Command = require('../../core/command');
const wump = require('wumpfetch');

module.exports = class DadJokeCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'dadjoke',
            description: 'Receive a dad joke',
            aliases: ['dad-joke'],
            category: 'Fun'
        });
    }

    /**
     * Run the `dadjoke` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const result = await wump({
            url: 'https://icanhazdadjoke.com',
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).send();
        const data = result.json();

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle('Dad Jokes')
                .setDescription(`:mega: **${data.joke}**`)
                .build()
        );
    }
};