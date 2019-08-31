const Command = require('../../core/command');

module.exports = class MessageInfoCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'messageinfo',
            description: 'Shows information about a Discord message',
            usage: '<channelID:messageID>',
            aliases: ['msginfo', 'msg-info', 'message-info'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `messageinfo` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const args = ctx.args.get(0).split(':');
        
        try {
            const message = await this.client.getMessage(args[0], args[1]);
            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setDescription(`**${message.content}**\n\n[Jump To](https://discordapp.com/channels/${ctx.guild? ctx.guild.id: '@me'}/${args[0]}/${message.id})`)
            );
        } catch(ex) {
            ctx.send(ex);
        }
    }
}