const Command = require('../../core/command');

module.exports = class ModeratorsCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'moderators',
            description: 'Views the current moderator list. Must have the `banMembers` permission!',
            aliases: ['mods', 'mod-list'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `moderators` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const msg     = await ctx.send("Admiral, I am now fetching all moderators...");
        const started = Date.now();

        let moderators = [];
        ctx.guild.members.filter(s => s.status === 'online' && s.permission.has('banMembers') && !s.bot).forEach(m => moderators.push(`<:online:457289010037915660> **${m.user.username}#${m.user.discriminator}**`));
        ctx.guild.members.filter(s => s.status === 'idle' && s.permission.has('banMembers') && !s.bot).forEach(m => moderators.push(`<:away:457289009912217612> **${m.user.username}#${m.user.discriminator}**`));
        ctx.guild.members.filter(s => s.status === 'dnd' && s.permission.has('banMembers') && !s.bot).forEach(m => moderators.push(`<:dnd:457289032330772502> **${m.user.username}#${m.user.discriminator}**`));
        ctx.guild.members.filter(s => s.status === 'offline' && s.permission.has('banMembers') && !s.bot).forEach(m => moderators.push(`<:offline:457289010084184066> **${m.user.username}#${m.user.discriminator}**`));

        await msg.delete();
        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(`Availiable Moderators in ${ctx.guild.name}:`)
                .setDescription(moderators.join('\n'))
                .setFooter(`Took ${Date.now() - started}ms to gather data`, ctx.sender.avatarURL || ctx.sender.defaultAvatarURL)
        );
    }
};