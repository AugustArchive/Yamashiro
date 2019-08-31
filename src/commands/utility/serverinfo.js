const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class ServerInfoCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'serverinfo',
            description: 'Gives information about a guild\'s or the current guild\'s information',
            usage: '[guild]',
            aliases: ['server-info', 'serverinformation', 'server-information', 'server', 'guild', 'guildinfo', 'guildinformation', 'guild-information'],
            category: 'Utility'
        });

        this.mutable = {
            regions: {
                'japan': '🇯🇵',
                'russia': '🇷🇺',
                'brazil': '🇧🇷',
                'london': '🇬🇧',
                'sydney': '🇦🇺',
                'eu-west': '🇪🇺',
                'us-west': '🇺🇸',
                'us-east': '🇺🇸',
                'us-south': '🇺🇸',
                'hongkong': '🇭🇰',
                'amsterdam': '🇳🇱',
                'singapore': '🇸🇬',
                'frankfurt': '🇩🇪',
                'us-central': '🇺🇸',
                'eu-central': '🇪🇺'
            },
            verifications: {
                '0': 'None',
                '1': 'Low',
                '2': 'Medium',
                '3': '(╯°□°）╯︵ ┻━┻',
                '4': '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
            },
            regionName: {
                'japan': 'Japan',
                'russia': 'Russia',
                'brazil': 'Brazil',
                'london': 'London',
                'sydney': 'Sydney',
                'eu-west': 'Western Europe',
                'us-west': 'US West',
                'us-east': 'US East',
                'us-south': 'US South',
                'hongkong': 'Hong Kong',
                'amsterdam': 'Amsterdam',
                'singapore': 'Singapore',
                'frankfurt': 'Frankfurt',
                'us-central': 'US Central',
                'eu-central': 'EU Central'
            }
        };
    }

    /**
     * Runs the `serverinfo` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const guild = await this.client.rest.getGuild(ctx.args.getRaw().length >= 1? ctx.args.gather(' '): ctx.guild.id);
        const user = await this.client.database.getUser(ctx.sender.id);

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(`[ Guild ${guild.name} ]`)
                .setDescription(stripIndents`
                    **ID**: ${guild.id}
                    **Created At**: ${this.client.util.parseDate(guild.createdAt, user.region)}
                    **Region**: ${this.mutable.regions[guild.region]} **${this.parseRegionName(guild.region)}**
                    **Owner**: <@${guild.ownerID}> (\`${guild.ownerID}\`)
                    **Members**: ${guild.memberCount.toLocaleString()}
                    **Roles [${guild.roles.size}]**: ${guild.roles.map(s => `<@&${s.id}>`).join(', ')}
                    **Verification Level**: ${this.mutable.verifications[guild.verificationLevel]}
                `)
                .build()
        );
    }

    /**
     * Parses the region name
     * @param {string} region The region
     */
    parseRegionName(region)
    {
        return this.mutable.regionName[region];
    }
};