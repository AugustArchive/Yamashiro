const EmbedBuilder = require('../../util/embed-builder');
const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class RoleInfoCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'roleinfo',
            description: 'Grabs information of a Discord role',
            usage: '<role>',
            aliases: ['role-info', 'role'],
            category: 'Utility'
        });
    }

    /**
     * Runs the `roleinfo` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        const member = ctx.guild.members.get(ctx.sender.id);
        const raw = ctx.args.getRaw();
        const role = await this.client.rest.getRole(raw.length >= 1? raw.join(' '): member.roles[0], ctx.guild);
        const user = await this.client.database.getUser(ctx.sender.id);

        return ctx.embed(
            new EmbedBuilder()
                .setTitle(`[ Role ${role.name} ]`)
                .setDescription(stripIndents`
                    **ID**: ${role.id}
                    **Created At**: ${this.client.util.parseDate(role.createdAt, user.region)}
                    **Position**: ${role.position - 1}
                    **Mentionable**: ${role.mentionable? 'Yes': 'No'}
                    **Hoisted**: ${role.hoist? 'Yes': 'No'}
                    **Managed**: ${role.managed? 'Yes': 'No'}
                    **Color**: #${parseInt(role.color).toString(16)}
                `)
                .setColor(role.color === 0? role.color: this.client.constants.COLOR)
                .build()
        );
    }
}