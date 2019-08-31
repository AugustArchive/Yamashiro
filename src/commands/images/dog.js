const Command = require('../../core/command');
const w = require('wumpfetch');

module.exports = class DogCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'dog',
            description: ':dog: Grabs an random puppyyy!!!',
            aliases: ['doggo', 'puppy'],
            category: 'Images'
        });
    }

    /**
     * Runs the `dog` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const res = await w({
            url: 'https://dog.ceo/api/breeds/image/random',
            method: 'GET'
        }).send();
        const data = res.json();

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(':dog: Woof!! :dog:')
                .setURL(data.message)
                .setImage(data.message)
                .build()
        );
    }
}