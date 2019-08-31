const Command = require('../../core/command');
const cheerio = require('cheerio');
const wump    = require('wumpfetch');

module.exports = class FMLCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'fml',
            description: 'Shows how people can be stupid by fucking up their life with random situations...',
            aliases: ['fuckmylife', 'fuck-my-life'],
            category: 'Fun'
        });
    }

    /**
     * Runs the `fml` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const result = await wump({
            url: 'https://www.fmylife.com/random',
            method: 'GET'
        }).send();
        
        const body = result.text();
        const $ = cheerio.load(body);
        const quote = $(".article-contents > a").first().text();

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle('FML')
                .setDescription(`**${quote}**`)
                .build()
        );
    }
}