const Command = require('../../core/command');

module.exports = class ClapifyCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'clapify',
            description: ':clap: Make :clap: all :clap: messages :clap: like :clap: this :clap:',
            usage: '<text>',
            aliases: ['clap'],
            category: 'Fun'
        });

        this.emoji = ':clap:';
    }

    /**
     * Run the `clapify` command
     * @param {import('../../core/context')} ctx The command context 
     */
    run(ctx)
    {
        if (ctx.args.isEmpty(0)) return ctx.send('Admiral, you\'re missing the `text` argument.');
        return ctx.send(`${this.emoji} ${ctx.args.gather(` ${this.emoji} `)} ${this.emoji}`);
    }
};