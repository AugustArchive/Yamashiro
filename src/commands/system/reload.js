const Command = require('../../core/command');

module.exports = class EvalCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'reload',
            description: 'Reloads all commands or a specific command',
            usage: '[cat:command]',
            category: 'System Administration',
            ownerOnly: true,
            hidden: true
        });

        this.fs = require('fs');
    }

    /**
     * Runs the `eval` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0)) {
            const m = await ctx.send("Commander, I am now reloading all commands...");
            const cat = await this.fs.readdirSync(__dirname);
            for (let i = 0; i < cat.length; i++)
            {
                const category = cat[i];
                this.fs.readdir(`${__dirname}/${category}`, (error, files) => {
                    if (error) return m.edit(`I was unable to get files: \`\`\`\n${error}\`\`\``);
                    files.forEach(f => {
                        try {
                            const Command = require(`../../commands/${category}/${f}`);
                            delete require.cache[Command];
    
                            const cmd = new Command(this.client);
                            if (cmd.disabled) return;
                            this.client.manager.commands.delete(cmd.command);
                            this.client.manager.commands.set(cmd.command, cmd);
                        } catch(ex) {
                        }
                    });
                });
            }

            await m.delete();
            return ctx.send(`Commander, I've reloaded all commands!`);
        }

        const arg = ctx.args.get(0);
        const arr = arg.split(':');
        if (!arr[0]) return ctx.send("Commander, you need to append a valid category!");
        if (!arr[1]) return ctx.send("Commander, you need to append a valid command name!");

        const a = require(`../${arr[0]}/${arr[1]}`);
        if (!a) return ctx.send("Commander, I was unable to find the command! Check your spelling~");

        delete require.cache[a];
        const cmd = new a(this.client);
        if (cmd.disabled) return ctx.send("Commander, I can't reload the command if it's been disabled");
        this.client.manager.commands.delete(cmd.command);
        this.client.manager.commands.set(cmd.command, cmd);
        return ctx.send("Commander, I reloaded the command you suggested~");
    }
}