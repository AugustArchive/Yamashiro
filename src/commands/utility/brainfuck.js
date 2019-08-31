const Command   = require('../../core/command');
const Brainfuck = require('brainfuck-node');

module.exports = class BrainfuckCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'brainfuck',
            description: 'Executes brainfuck code',
            usage: '<script>',
            aliases: ['bf'],
            category: 'Utility'
        });

        this.parser = new Brainfuck();
    }

    /**
     * Runs the `brainfuck` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (!ctx.args.get(0)) return ctx.send('Admiral, you\'re missing the `<script>` argument!');
        const script = ctx.args.get(0);

        try {
            const result = this.parser.execute(script);
            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle('Brainfuck')
                    .setDescription(result.output? `\`\`\`\n${result.output}\`\`\``: 'null')
                    .build()
            );
        } catch(ex) {
            const error = ex.toString();
            if (error.startsWith('BrainfuckError')) return ctx.send('Admiral, an unknown error occured! ```js\n' + error + '```');
        }
    }
};