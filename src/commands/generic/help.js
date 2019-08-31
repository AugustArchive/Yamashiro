const { stripIndents } = require('common-tags');
const Command          = require("../../core/command");

module.exports = class HelpCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'help',
            description: (client) => `Shows a full list of ${client.user.username}'s commands or gives documentation on a command.`,
            usage: '[command]',
            aliases: ['halp', 'h', 'cmds', 'commands']
        });
    }

    /**
     * Runs the `help` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const categories = {};
        const settings   = await this.client.database.models['guilds'].findOne({ id: ctx.guild.id }).exec();

        if (ctx.args.isEmpty(0))
        {
            this
                .client
                .manager
                .commands
                .filter(c => !c.hidden)
                .forEach((command) => {
                    if (!categories[command.category]) categories[command.category] = [];
                    categories[command.category].push(command.command);
                });

            const embed = this
                .client
                .getEmbed()
                .setTitle(`${this.client.user.username}#${this.client.user.discriminator} — Commands List`)
                .setDescription(stripIndents`
                    **Use \`${settings.prefix}help [command]\` to get documentation a command**
                    [**\`Server\`**](${this.client.constants.discord}) **|** [**\`Upvote\`**](${this.client.constants.upvote})
                `)
                .setFooter(`Use "${settings.prefix}help [command]" to get help on a command! // ${this.client.manager.commands.filter(s => !s.hidden).length} Commands Avaliable`);

            for (const cat in categories) embed.addField(cat.toUpperCase(), categories[cat].map(s => `**\`${s}\`**`).join(', '));
            return ctx.embed(embed.build());
        }

        const arg     = ctx.args.get(0);
        const command = this.client.manager.commands.filter(c => c.command === arg && !c.hidden);

        if (command.length > 0)
        {
            const cmd = command[0];
            return ctx.embed(cmd.generateHelp());
        } else return ctx.send(`Sorry, I couldn't find the command \`${arg}\`, admiral.`);
    }
};