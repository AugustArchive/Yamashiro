const Command = require('../../core/command');
const w = require('wumpfetch');

module.exports = class RedditCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'reddit',
            description: 'Sets the reddit feed configuration',
            usage: '<"enabled" | "channelID" | "subreddit"> <value>',
            aliases: ['setreddit'],
            guildOnly: true,
            category: 'Settings'
        });

        this.mutable = {
            strings: {
                ERROR: (x) => `Admiral, I was unable to ${x}.`,
                INVALID_ARG: (arg) => `Admiral, invalid arg \`${arg}\`.`,
                FINALIZED: (arg) => `Admiral, Now the ${arg}`
            }
        };
    }

    /**
     * Runs the `reddit` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (!this.client.admins.includes(ctx.sender.id) || !ctx.member.permission.has('manageGuild')) return ctx.send(':name_badge: **| Admiral, you are missing the following permission: `Manage Guild`**');

        const subcommand = ctx.args.get(0);
        switch (subcommand)
        {
            case "enabled": return ctx.send(await this.setEnabler(ctx.args.get(1), ctx.guild));
            case "channelID": return ctx.send(await this.setChannel(ctx.args.get(1), ctx.guild));
            case "subreddit": return ctx.send(await this.setSubreddit(ctx.args.get(1), ctx.guild));
            default: return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle('reddit subcommands')
                    .setDescription(require('common-tags').stripIndents`
                        \`${process.env.YAMASHIRO_PREFIX}reddit enabled <boolean>\`: Enables or Disables the reddit feed feature
                        \`${process.env.YAMASHIRO_PREFIX}reddit channelID <channelID>\`: Sets the channel to send the payload to the channel
                        \`${process.env.YAMASHIRO_PREFIX}reddit subreddit <subreddit>\`: Sets the subreddit to fetch from
                    `)
                    .build()
                );
        }
    }

    /**
     * Enables/Disables the reddit feed feature
     * @param {string} arg The argument
     * @param {import('eris').Guild} guild The guild
     */
    setEnabler(arg, guild)
    {
        if (!['true', 'false'].includes(arg)) return this.mutable.strings.INVALID_ARG(arg);
        const enabled = arg === 'true'? true: false;
        this.client.database.models.guilds.findOne({ id: guild.id }, { 
            $set: { 
                'reddit.enabled': enabled 
            } 
        }, (error) => {
            if (error) return this.mutable.strings.ERROR(`${enabled? 'enable': 'disable'} the reddit feature`);
            return this.mutable.strings.FINALIZED(`reddit feature is ${enabled? 'enabled': 'disabled'}!`);
        });
    }

    /**
     * Sets the channel
     * @param {string} arg The argument
     * @param {import('eris').Guild} guild The guild
     */
    async setChannel(arg, guild)
    {
        const channel = await this.client.rest.getChannel(arg, guild);
        if (!channel || channel !== 0) return 'Admiral, the channel was not found or the channel isn\'t a text channel';

        this.client.database.models.guilds.updateOne({ id: guild.id }, {
            $set: {
                'reddit.channelID': channel.id
            }
        }, (error) => {
            if (error) return this.mutable.strings.ERROR(`make <#${channel.id}> the place to send embeds!`);
            return this.mutable.strings.FINALIZED(`channel <#${channel.id}> is the place to send embeds!`);
        });
    }

    /**
     * Sets the subreddit
     * @param {string} arg The argument
     * @param {import('eris').Guild} guild The guild
     */
    async setSubreddit(arg, guild)
    {
        const req = await w({
            url: `https://www.reddit.com/r/${arg}/about.json`,
            method: 'GET'
        }).send();
        const { data } = req.json();

        if (data.error === 404) return `Admiral, subreddit **r/${arg}** doesn't exist!`;
        if (data.error === 401) return `Admiral, subreddit **r/${arg}** is privated.`;
        this.client.database.models['guilds'].updateOne({ id: guild.id }, {
            $set: {
                'reddit.subreddit': arg
            }
        }, (error) => {
            if (error) return this.mutable.strings.ERROR(`set the subreddit to **r/${arg}**!`);
            return this.mutable.strings.FINALIZED(`subreddit is now **r/${arg}**!~`);
        });
    }
}