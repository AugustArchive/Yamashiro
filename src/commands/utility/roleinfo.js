const EmbedBuilder = require('../../util/embed-builder');
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
        const id = ctx.args.isEmpty(0)? member.roles[Math.floor(Math.random() * member.roles.length)]: raw.join(' ');
        const role = await this.client.rest.getRole(id, ctx.guild);
        const user = await this.client.database.getUser(ctx.sender.id);

        return ctx.embed(
            new EmbedBuilder()
                .setTitle(`[ Role ${role.name} ]`)
                .setDescription(`:birthday: **${this.client.util.parseDate(role.createdAt, user.region)}**`)
                .setFooter(`ID: ${role.id}`)
                .addField('Position', (role.position - 1), true)
                .addField('Mentionable', role.mentionable? 'Yes': 'No', true)
                .addField('Managed', role.managed? 'Yes': 'No', true)
                .addField('Color', `#${parseInt(role.color).toString(16)}`, true)
                .setColor(role.color === 0? this.client.constants.COLOR: role.color)
                .build()
        );
    }
}