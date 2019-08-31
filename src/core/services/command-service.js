const { Collection }   = require('eris');
const CommandContext   = require('../context');
const { stripIndents } = require('common-tags');

module.exports = class CommandService
{
    /**
     * Create a new instance of the command service
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client = client;
        /** @type {Collection<Collection<number>>} */
        this.ratelimits = new Collection();
    }

    /**
     * Run the command service
     * @param {import('eris').Message} msg The message
     */
    async run(msg)
    {
        this.client.messagesSeen++;
        if (msg.author.bot || !this.client.ready) return;

        const guild = await this.client.database.getGuild(msg.channel.guild.id);
        await this.client.database.getUser(msg.author.id);

        let prefix = null;
        const mention = new RegExp(`^<@!?${this.client.user.id}> `).exec(msg.content);
        const prefixes = [`${mention}`, guild.prefix, process.env.YAMASHIRO_PREFIX];

        for (const pre of prefixes) if (msg.content.startsWith(pre)) prefix = pre;
        if (!prefix) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift();
        const command = this.client.manager.commands.filter(c => c.command === commandName || c.aliases.includes(commandName));
        const context = new CommandContext(this.client, msg, args);

        if (command.length > 0)
        {
            const cmd = command[0];
            if (cmd.guildOnly && msg.channel.type === 1) return context.send(`Unable to run the \`${cmd.command}\` command because you're not in a guild.`);
            if (cmd.ownerOnly && !this.client.admins.includes(msg.author.id)) return context.send(`Unable to run the \`${cmd.command}\` command because you're not my owner!!`);

            if (!this.ratelimits.has(cmd.command)) this.ratelimits.set(cmd.command, new Collection());
            const now = Date.now();
            const timestamps = this.ratelimits.get(cmd.command);
            const throttle = (cmd.throttle || 3) * 1000;

            if (!timestamps.has(context.sender.id)) {
                timestamps.set(context.sender.id, now);
                setTimeout(() => timestamps.delete(context.sender.id), throttle);
            } else {
                const time = timestamps.get(context.sender.id);
                if (now < time) {
                    const left = (time - now) / 1000;
                    const embed = this.client.getEmbed();

                    embed.setDescription(`**${context.sender.id}, the command \`${cmd.command}\` is currently on cooldown for another ${left > 1? `${left.toFixed()} seconds`: `${left.toFixed()} second`}.**`);
                    return context.embed(embed.build());
                }

                timestamps.set(context.sender.id, now);
                setTimeout(() => timestamps.delete(context.sender.id), throttle);
            }

            try {
                await cmd.run(context);
                this.client.commandsExecution++;
                this.client.commandUsage[cmd.command] = (this.client.commandUsage[cmd.command] || 0) + 1;
            } catch(ex) {
                const embed = this.client.getEmbed();
                embed
                    .setTitle(`Command ${cmd.command} failed`)
                    .setDescription(stripIndents`
                        \`\`\`js
                        ${ex.stack.split('\n')[0]}
                        ${ex.stack.split('\n')[1]}
                        ${ex.stack.split('\n')[2]}
                        ${ex.stack.split('\n')[3]}
                        \`\`\`

                        Contact \`August#5820\` in here: ***<https://discord.gg/yDnbEDH>***
                    `);
                context.embed(embed.build());
                this.client.logger.error(`Unable to run the ${cmd.command} command:\n${ex.stack}`);
            }
        }
    }
};