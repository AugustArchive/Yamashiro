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
        const owner = this.client.users.get(guild.ownerID);
        const user = await this.client.database.getUser(ctx.sender.id);

        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(`[ Guild ${guild.name} ]`)
                .setDescription(`:birthday: **${this.client.util.parseDate(guild.createdAt, user.region)}**`)
                .setThumbnail(guild.icon? guild.iconURL: null)
                .setFooter(`ID: ${guild.id}`, guild.icon? guild.iconURL: null)
                .addField(`${this.mutable.regions[guild.region]} Region`, this.parseRegionName(guild.region), true)
                .addField('Owner', `**${owner.username}#${owner.discriminator}** (\`${guild.ownerID}\`)`)
                .addField(`Members [${guild.memberCount.toLocaleString()}]`, `<:online:457289010037915660> **${guild.members.filter(s => s.status === 'online').length} Online** | <:offline:457289010084184066> **${ctx.guild.members.filter(s => s.status === 'offline').length} Offline**`, true)
                .addField('Verification Level', this.mutable.verifications[guild.verificationLevel], true)
                .addField(`Channels [${guild.channels.size}]`, `**Text: ${guild.channels.filter(s => s.type === 0).length}** | **Voice: ${guild.channels.filter(s => s.type === 3).length}**`)
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