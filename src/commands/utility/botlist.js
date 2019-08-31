const Command = require('../../core/command');
const w       = require('wumpfetch');

module.exports = class BotListCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'botlist',
            description: 'Grabs information from Carbonitex about the highest to lowest bots.',
            usage: '<page>',
            aliases: ['bots'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `botlist` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const request = await w({
            url: 'https://www.carbonitex.net/discord/api/listedbots',
            method: 'GET'
        }).send();
        const data = request.json();

        let page = 1;
        data.sort((a, b) => Number(a.servercount) === Number(b.servercount)? 0: +(Number(a.servercount) < Number(b.servercount)) || -1);
        if (ctx.args.get(0) && !isNaN(ctx.args.get(0))) page = Number(ctx.args.get(0));
        else page = 1;

        let startAt = (page - 1) * 10;
        if (data[startAt])
        {
            const embed = this.client.getEmbed().setFooter(`Carbonitex Bot List | Page ${page}/${Math.ceil(data.length / 10)}`);
            let content = '';
            let limit = 0;

            if (data[startAt + 10]) limit = startAt + 10;
            else limit = data.length;

            for (let i = startAt; i < limit; i++) content += `${i + 1}: ${data[i].name} - ${Number(data[i].servercount).toLocaleString()} Guilds\n`;

            embed.setDescription(`\`\`\`\n${content}\`\`\``);
            return ctx.embed(embed.build());
        }
    }
}