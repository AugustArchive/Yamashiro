const Command = require('../../core/command');

module.exports = class CleanCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'clean',
            description: 'Cleans Yamashiro\'s messages for convience sake.',
            usage: '<amount:{1-100}>',
            aliases: ['purge'],
            category: 'System Administration',
            ownerOnly: true,
            guildOnly: true,
            hidden: true
        });
    }

    /**
     * Runs the `clean` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx) {
        if (ctx.args.isEmpty(0)) return ctx.send('Commander, you\'re missing the `amount` argument.');
        
        const amount = ctx.args.get(0);
        if (isNaN(amount)) return ctx.send('Commander, the number you provided is not a number.');
        if (Number(amount) < 2) return ctx.send('Commander, the number you provided is lower then 1.');
        if (Number(amount) > 100) return ctx.send('Commander, the number you provided is higher then 100.');

        const clean = Number(amount);
        let messages = await ctx.message.channel.getMessages(clean, ctx.message.id);
        messages = messages.filter(m => m.author.id === this.client.user.id);
        await Promise.all(messages.map(s => s.delete()));
        return ctx.send(`Commander, I've successfully cleaned up \`${messages.length}\` messages!`);
    }
}