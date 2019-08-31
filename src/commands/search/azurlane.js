const { stripIndents } = require('common-tags');
const EmbedBuilder = require('../../util/embed-builder');
const Command = require('../../core/command');
const { AzurLaneClient } = require('@yamashiro/modules');

module.exports = class AzurLaneCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'azurlane',
            description: 'Searchs information about an Azur Lane character ~~thats lewd~~',
            usage: '<query>',
            category: 'Search',
            aliases: ['shipgirl']
        });

        this.azurlane = new AzurLaneClient();
        this.chapters = {
            1: 'Chapter 1',
            2: 'Chapter 2',
            3: 'Chapter 3',
            4: 'Chapter 4',
            5: 'Chapter 5',
            6: 'Chapter 6',
            7: 'Chapter 7',
            8: 'Chapter 8',
            9: 'Chapter 9',
            10: 'Chapter 10',
            11: 'Chapter 11',
            12: 'Chapter 12'
        };
        this.levels = {
            1: 'Level 1',
            2: 'Level 2',
            3: 'Level 3',
            4: 'Level 4'
        };
    }

    /**
     * Runs the `azurlane` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0)) return ctx.send('Admiral, you\'re missing the `query` argument');

        const query = await this.azurlane.getShipgirl(ctx.args.get(0));
        const embed = new EmbedBuilder()
            .setTitle(`${query.names.en} (${query.names.jp}, #${query.id})`)
            .setURL(query.pageUrl)
            .setColor(this.client.constants.API.AzurLane)
            .setDescription(`**${query.type}**`)
            .setThumbnail(query.chibi)
            .addField('Construction Time', query.constructionTime, true)
            .addField('Rarity', query.rarity, true)
            .addField('Class', query.class, true)
            .addField('Nationality', query.nationality, true)
            .addField('Base', stripIndents`
                **Health**: ${query.base.health}
                **Armor**: ${query.base.armor}
                **Reload**: ${query.base.reload}
                **Firepower**: ${query.base.firepower}
                **Torpedo**: ${query.base.torpedo}
                **Speed**: ${query.base.speed}
                **Anti Air**: ${query.base.antiAir}
                **Air Power**: ${query.base.airPower}
                **Oil Usage**: ${query.base.oilUsage}
                **Anti Sub**: ${query.base.antiSub}
            `, true)
            .addField('Max', stripIndents`
                **Health**: ${query.max.health}
                **Armor**: ${query.max.armor}
                **Reload**: ${query.max.reload}
                **Firepower**: ${query.max.firepower}
                **Torpedo**: ${query.max.torpedo}
                **Speed**: ${query.max.speed}
                **Anti Air**: ${query.max.antiAir}
                **Air Power**: ${query.max.airPower}
                **Oil Usage**: ${query.max.oilUsage}
                **Anti Sub**: ${query.max.antiSub}
            `, true)
            .addField('Reinforcement Value', stripIndents`
                **Firepower**: ${query.reinforcementValue.firepower}
                **Torpedo**: ${query.reinforcementValue.torpedo}
                **Air Power**: ${query.reinforcementValue.airPower}
                **Reload**: ${query.reinforcementValue.reload}
            `, true)
            .addField('Scrap Income', stripIndents`
                **Coin**: ${query.scrapIncome.coin}
                **Oil**: ${query.scrapIncome.oil}
                **Medal**: ${query.scrapIncome.medal}
            `, true)
            .addField('Equipment', query.equipment.map(s => stripIndents`
                Slot #${s.slot}:
                **Efficiency**: ${s.efficiency}
                **Equipable**: ${s.equipable}
            `).join('\n\n'))
            .addField('Drop Locations', query.drops.map(s => {
                const spl = s.split('-');
                return `${this.chapters[spl[0]]}, ${this.levels[spl[1]]}`;
            }).join('\n'), true);

        return ctx.embed(embed.build());
    }
}