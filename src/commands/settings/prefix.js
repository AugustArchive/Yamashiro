const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class PrefixCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'prefix',
            description: 'Views or sets the prefix',
            usage: '<prefix>',
            aliases: ['setprefix'],
            guildOnly: true,
            category: 'Settings'
        });
    }

    /**
     * Runs the `prefix` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (!ctx.member.permission.has('manageGuild') || !this.client.admins.includes(ctx.sender.id)) return ctx.send(':name_badge: **| Admiral, you are missing the following permission: `Manage Guild`**');

        const prefix = ctx.args.get(0);
        const settings = await this.client.database.getGuild(ctx.guild.id);
        if (!prefix) return ctx.send(`Admiral, the current prefix is \`${settings['prefix']}\`.`);
        if (['@everyone', '@here'].includes(prefix)) return ctx.send("Admiral, you cant make mentionable prefixes");
        this.client.database.models.guilds.updateOne({ id: ctx.guild.id }, { $set: { prefix } }, (error) => {
            if (error) return ctx.send('Admiral, I couldn\'t change the prefix! Sorry... :c');
            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle('The command prefix has changed!')
                    .setDescription(stripIndents`
                        The command prefix has been changed to \`${prefix}\`
                        Try it out by typing \`${prefix}ping\`

                        :pencil: **You can always use ${process.env.YAMASHIRO_PREFIX}<command> or @Yamashiro <command> as prefixes!**
                    `)
                    .build()
            );
        });
    }
}