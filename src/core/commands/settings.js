const Command = require('../command');

module.exports = class SettingsCommand extends Command
{
    /**
     * Create a new instance of the settings command
     * @param {import('../client')} client The client
     * @param {import('../command').CommandInfo & { type: "guild" | "user" }} info The command options
     */
    constructor(client, info)
    {
        super(client, Object.assign({ 
            category: 'Settings', 
            guildOnly: true
        }, info));

        this.type = info.type;
    }

    /**
     * Executes the command (actually)
     * @param {import('../context')} ctx The command context
     */
    async execute(ctx) {}

    /**
     * Runs the command
     * @param {import('../context')} ctx The command context
     */
    async run(ctx)
    {
        if (
            !ctx.guild.members.get(ctx.sender.id).permission.has('manageGuild') || 
            !this.client.admins.includes(ctx.sender.id) ||
            this.type === 'guild'
        ) return ctx.send("Admiral, you don't have permission to edit the guild's configuration! (`BOT_OWNER` or `Manage Guild`)");

        return this.execute(ctx);
    }
};