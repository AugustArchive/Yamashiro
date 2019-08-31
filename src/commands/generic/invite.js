const Command = require('../../core/command');

module.exports = class InviteMeCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'invite',
            description: (client) => `Invites ${client.user.username} to your server!`,
            aliases: ['inviteme', 'invitation', 'inv']
        });
    }

    /**
     * Runs the `invite` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        return ctx.embed(
            this
                .client
                .getEmbed()
                .addField('Invite Me', `https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot`, true)
                .addField('Discord', 'https://discord.gg/yDnbEDH', true)
                .addField('Subreddit', 'https://www.reddit.com/r/Yamashiro', true)
                .build()
        );
    }
};