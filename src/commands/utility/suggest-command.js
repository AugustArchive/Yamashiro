const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class SuggestCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'suggest-command',
            description: 'Suggests an random command!',
            aliases: ['random-command', 'random-cmd'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `suggest-command` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const command = this.client.manager.commands.random();
        return ctx.send(stripIndents`
            Admiral, have you tried the \`${command.command}\` command?
            *${typeof command.description === 'function'? command.description(this.client): command.description}*
        `);
    }
};