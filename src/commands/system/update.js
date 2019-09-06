const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class UpdateCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'update',
            description: 'Updates the bot to a new version and restarts',
            category: 'System Administration',
            ownerOnly: true,
            hidden: true
        });

        this.cp = require('child_process');
    }

    /**
     * Runs the `eval` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const stdout = this.cp.execSync('git pull').toString();
        await ctx.send(stripIndents`
            :white_check_mark: **| Now restarting bot! Providing the output**:
            \`\`\`prolog
            ${stdout}
            \`\`\`
        `);
        this.cp.execSync('pm2 restart 0');
    }
}