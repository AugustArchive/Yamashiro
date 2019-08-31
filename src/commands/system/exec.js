const { stripIndents } = require('common-tags');
const Command = require('../../core/command');

module.exports = class EvalCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'exec',
            description: 'Evalutes arbitrary Shell code within the terminal',
            usage: '<script>',
            aliases: ['sh'],
            category: 'System Administration',
            ownerOnly: true,
            hidden: true
        });

        this.child = require('child_process');
    }

    /**
     * Runs the `exec` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0)) return ctx.send("Commander, you're missing the `<script>` argument");

        const script  = ctx.args.gather(' ');
        const started = Date.now();

        this.child.exec(script, (error, stdout, stderr) => {
            if (error) return ctx.send(stripIndents`
                Commander, the execution errored! ${Date.now() - started}ms
                \`\`\`sh
                ${stderr}
                \`\`\`
            `);
            return ctx.send(stripIndents`
                Commander, the execution was a success! ${Date.now() - started}ms
                \`\`\`sh
                ${stdout}
                \`\`\`
            `);
        });
    }
}