const { stripIndents } = require('common-tags');
const Command = require('../../core/command');
const Modules = require('@yamashiro/modules');

module.exports = class OSUCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'osu',
            description: 'Searches osu-related stuff',
            usage: '<"user" | "beatmap"> <id>',
            aliases: ['osu!'],
            category: 'Search'
        });

        this.osu = new Modules.OSUClient(process.env.PPY);
    }

    /**
     * Runs the `osu!` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        switch (ctx.args.get(0))
        {
            case "user": return this.user(ctx);
            case "beatmap": return this.beatmap(ctx);
            default: {
                return ctx.embed(
                    this
                        .client
                        .getEmbed()
                        .setTitle('osu!subcommands')
                        .setDescription(stripIndents`
                            \`${process.env.YAMASHIRO_PREFIX}osu beatmap\`: Searches a beatmap on osu
                            \`${process.env.YAMASHIRO_PREFIX}osu user\`: Searches information about an osu!user
                        `)
                        .build()
                );
            };
        }
    }

    /**
     * Runs the `osu user` subcommand
     * @param {import('../../core/context')} ctx The command context
     */
    async user(ctx)
    {
        let u = ctx.args.get(1);
        if (!u) return ctx.send('Admiral, you didn\'t provide a username or user id!');
        const data = await this.osu.getUser(u, ctx.args.get(2)? 0: parseInt(ctx.args.get(2)));
        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(`User ${data.username} | #${data.id}`)
                .setDescription(`Rank **#${data.pp.rank.toLocaleString()}** | ${data.country}`)
                .addField('Joined At', data.joinedAt, true)
                .addField('Play Count', data.playcount.toLocaleString(), true)
                .addField('Ranked/Total Score', `${data.rankedScore.toLocaleString()}/${data.totalScore.toLocaleString()}`, true)
                .addField('PP', data.pp.raw.toLocaleString(), true)
                .addField('Accuracy', `${data.accuracy}%`, true)
                .addField('Counts', stripIndents`
                    **SSH**: ${data.countRanks.ssh}
                    **SS**: ${data.countRanks.ss}
                    **SH**: ${data.countRanks.sh}
                    **S**: ${data.countRanks.s}
                    **A**: ${data.countRanks.a}
                    
                    **300**: ${data.counts['300']}
                    **100**: ${data.counts['100']}
                    **50**: ${data.counts['50']}
                `, true)
                .setImage(`http://lemmmy.pw/osusign/sig.php?color=hex8971D4&uname=${u}&mode=${ctx.args.get(2)? 0: parseInt(ctx.args.get(2))}&pp=2&countryrank&darktriangles&xpbar&xpbarhex&onlineindicator=undefined`)
        );
    }

    /**
     * Runs the `osu beatmap` subcommand
     * @param {import('../../core/context')} ctx The command context
     */
    async beatmap(ctx)
    {
        const b = ctx.args.get(1);
        if (!b) return ctx.send('Admiral, you didn\'t provide a beatamp id!');

        const data = await this.osu.getBeatmap(b);
        return ctx.embed(
            this
                .client
                .getEmbed()
                .setTitle(`Beatmap ${data.artist} - ${data.title} | #${data.id}`)
                .setDescription(`**State**: **\`${data.approved}\`**`)
                .addField('Creator', data.creator, true)
                .addField('Stars', `:star: **${data.stars}**`, true)
                .addField('Beats Per Minute (BPM)', data.bpm, true)
                .addField('Circle Size', data.cs, true)
                .addField('Overall Difficulty', data.od, true)
                .addField('Approach Rate', data.ar, true)
                .addField('Health Drain', data.hp, true)
                .addField('Source', data.source || 'None', true)
                .addField('Genre', data.genre, true)
                .addField('Language', data.language, true)
                .addField('Play Count', data.playcount.toLocaleString(), true)
                .addField('Pass Count', data.passcount.toLocaleString(), true)
                .build()
        );
    }
}