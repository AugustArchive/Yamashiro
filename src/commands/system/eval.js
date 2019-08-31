const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class EvalCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'eval',
            description: 'Evalutes arbitrary JavaScript code within the bot',
            usage: '<script>',
            aliases: ['ev', 'evl', 'script', 'js'],
            category: 'System Administration',
            ownerOnly: true,
            hidden: true
        });

        this.util = require('util');
    }

    /**
     * Runs the `eval` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0)) return ctx.send("Commander, you're missing the `<script>` argument");

        const script  = ctx.args.gather(' ');
        const isAsync = (script.includes('await') || script.includes('return'));
        const started = Date.now();

        try {
            let result = await eval(isAsync? `(async() => {${script}})()`: script);
            if (typeof result !== 'string') result = this.util.inspect(result, {
                depth: +!(this.util.inspect(result, { depth: 1 })),
                showHidden: true
            });

            const res = this.client.redact(result);
            return ctx.send(stripIndents`
                Commander, the script was successful! ${Date.now() - started}ms
                \`\`\`js
                ${res}
                \`\`\`
            `);
        } catch(ex) {
            return ctx.send(stripIndents`
                Commander, the script errored! ${Date.now() - started}ms
                \`\`\`js
                ${ex.stack}
                \`\`\`
            `);
        }
    }
}