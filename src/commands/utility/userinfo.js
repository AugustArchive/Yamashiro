const Command = require('../../core/command');

module.exports = class UserInfoCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'userinfo',
            description: 'Shows information about a user.',
            usage: '[user]',
            aliases: ['user', 'user-info', 'user-information', 'userinformation'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `userinfo` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const user  = await this.client.rest.getUser(ctx.args.getRaw().length >= 1? ctx.args.gather(" "): ctx.sender.id);
        const u     = await this.client.database.getUser(user.id);
        const embed = this
            .client
            .getEmbed()
            .setTitle(`[ User ${user.username}#${user.discriminator} ]`)
            .setThumbnail(user.avatarURL || user.defaultAvatarURL)
            .addField('ID', user.id, true)
            .addField('Created At', `${this.client.util.parseDate(user.createdAt, u.region)} (Region: **${u.region}**)`, true)
            .addField('Bot', user.bot? 'Yes': 'No', true);

        if (ctx.guild && ctx.guild.members.get(user.id))
        {
            const member = ctx.guild.members.get(user.id);
            if (member.nick) embed.addField('Nickname', member.nick || 'None', true);

            embed
                .addField('Status', this.determineStatus(member.status), true)
                .addField(`Roles [${member.roles.length}]`, member.roles.map(s => `<@&${s}>`).join(', '), true)
                .addField('Mutual Guilds', this.client.guilds.filter(s => s.members.has(user.id)).map(s => `**${s.name}**`).join(' | '), true)
                .addField('Joined At', require('@yamashiro/modules').dateformat(member.joinedAt, 'mm/dd/yyyy hh:MM:ssTT'));

            if (member.game) embed.setDescription(`${(member.game.type === 0? 'Playing': member.game.type === 1? 'Streaming': member.game.type === 2? 'Listening To': member.game.type === 3? 'Watching': '')} **${member.game.name}**`);
            if (member.voiceState.channelID && ctx.guild.channels.has(member.voiceState.channelID))
            {
                const vc = ctx.guild.channels.get(member.voiceState.channelID);
                embed
                    .addField('Voice Channel', `${vc.name} (\`${vc.id}\`)`)
                    .addField('Muted', member.voiceState.mute || member.voiceState.selfMute? 'Yes': 'No')
                    .addField('Deaf', member.voiceState.deaf || member.voiceState.selfDeaf? 'Yes': 'No');
            }
        }

        return ctx.embed(embed.build());
    }

    /**
     * Determines the status of a user
     * @param {string} status The status
     * @returns {string} The status into a stirng
     */
    determineStatus(status) {
        return status === 'online'? '<:online:457289010037915660> **Online**': status === 'idle'? '<:away:457289009912217612> **Away**': status === 'dnd'? '<:dnd:457289032330772502> **Do not Disturb**': '<:offline:457289010084184066> **Offline**';
    }
}