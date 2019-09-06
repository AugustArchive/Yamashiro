const EmbedBuilder = require('../../util/embed-builder');
const Command = require('../../core/command');
const { AniListClient: AniList } = require('@yamashiro/modules');

module.exports = class AnimeCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'anime',
            description: 'Searchs any anime from anilist.co',
            usage: '<query>',
            aliases: ['animu'],
            category: 'Search',
            disabled: true
        });

        this.anilist = new AniList();
        this.seasons = {
            WINTER: ':snowflake:',
            SPRING: ':hibiscus:',
            SUMMER: ':sunny:',
            FALL: ':fallen_leaf:'
        };
        this.statuses = {
            FINISHED: 'Finished',
            RELEASING: 'Releasing',
            NOT_YET_RELEASED: 'Unreleased',
            CANCELLED: 'Cancelled'
        };
        this.months = {
            1: 'January',
            2: 'Febuary',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };
    }

    /**
     * Runs the `anime` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx) 
    {
        if (ctx.args.isEmpty(0)) return ctx.send("Admiral, you're missing the `query` argument");
        const search = ctx.args.args.slice(0).join(' ');
        const id = await this.anilist.search(search, {
            type: 'ANIME'
        });
        if (!id) return ctx.send("Admiral, the anime doesn't exist on AniList!");

        const data = await this.anilist.getAnime(id);
        const embed = new EmbedBuilder()
            .setTitle(data.titles.english || data.titles.romaji)
            .setThumbnail(data.coverImage.large || null)
            .setColor(this.client.constants.API.AniList)
            .setDescription(data.description? this.client.util.cleanAniList(data.description): 'No description')
            .addField('Current Status', this.statuses[data.status], true)
            .addField('Episodes', data.episodes || '???', true)
            .addField('Start Date', `${this.seasons[data.season]} ${this.months[data.startDate.month]} ${data.startDate.year}`, true);

        return ctx.embed(embed.build());
    }
};