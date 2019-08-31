const Command = require('../../core/command');

module.exports = class ChannelInfoCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'channelinfo',
            description: 'Shows information about a Discord text, voice, or category channel!',
            usage: '<channel>',
            aliases: ['channel-info', 'chaninfo'],
            category: 'Utility',
            guildOnly: true
        });

        this.channelTypes = {
            0: 'Text',
            1: 'Voice',
            4: 'Category'
        };
    }

    /**
     * Runs the `channelinfo` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const args = ctx.args.getRaw();
        const channel = await this.client.rest.getChannel(args.length >= 1? args.join(" "): ctx.channel.id);
        const user = await this.client.database.getUser(ctx.sender.id);
        const embed = this
            .client
            .getEmbed()
            .setTitle(`[ Channel ${channel.type === 0? `#${channel.name}`: channel.name}]`)
            .addField('ID', channel.id, true)
            .addField('Created At', this.client.util.parseDate(channel.createdAt, user.region), true)
            .addField('Channel Type', this.channelTypes[channel.type] || 'Unknown', true);

        if (channel.type === 0) embed
            .addField('NSFW', channel.nsfw? 'Yes': 'No', true)
            .addField('Topic', channel.topic? this.client.util.elipisis(channel.topic, 1350): 'No topic avaliable', true);

        if (!ctx.guild || !ctx.guild.channels.has(channel.id))
        {
            const guild = this.client.guilds.get(this.client.channelGuildMap[channel.id]);
            embed.addField('Guild', `**${guild.name}** (\`${guild.id}\`)`);
        }

        if (channel.type !== 4 && channel.parentID)
        {
            const cat = channel.guild.channels.get(channel.parentID);
            embed.addField('Category', cat.name, true);
        }

        if (channel.type === 2) embed
            .addField('Users Connect', channel.voiceMembers.size, true)
            .addField('User Limit', channel.userLimit, true);

        return ctx.embed(embed.build());
    }
}