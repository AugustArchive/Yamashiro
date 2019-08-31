const EmbedBuilder = require('../../util/embed-builder');
const BaseCommand = require('../command');
const w = require('wumpfetch');

module.exports = class RedditCommand extends BaseCommand
{
    /**
     * Constructs a new instance of the Reddit command
     * @param {import('../client')} client The client
     * @param {IRedditCommand} info The client info
     */
    constructor(client, info)
    {
        super(client, info);

        this.subreddit = info.subreddit;
        this.type = info.type;
    }

    /**
     * Generates an embed of the reddit command
     */
    async generate()
    {
        const { post } = await this.random(this.subreddit);
        return new EmbedBuilder()
            .setTitle(`r/${this.subreddit} | ${post.title}`)
            .setColor(0xFF4500)
            .setImage(post.post_hint === 'image'? post.url: null)
            .setDescription(post.post_hint !== 'image' && post.selftext.length <= 2000? this.client.util.elipisis(post.selftext.length): post.selftext)
            .setTimestamp(new Date(post.created_utc * 1000))
            .setFooter(`${this.client.util.formatNumber(post.ups)} upvotes`)
            .build();
    }

    /**
     * Generates the subreddit
     * @param {string} subreddit The subreddit
     */
    async random(subreddit)
    {
        const res = await w(`https://www.reddit.com/r/${subreddit}/${this.type}.json`, 'GET')
            .query({ limit: 100 })
            .send();
        const body = res.json();

        if (!body.data.children.length) return null;
        const posts = body.data.children.filter((post) => {
            if (!post.data) return false;
            if (post.data.over_18) return;
            return post.data.url && post.data.title;
        });

        if (!posts.length) return null;
        return {
            origin: subreddit,
            post: posts[Math.floor(Math.random() * posts.length)].data
        };
    }
};

/**
 * @typedef {object} RedditCommandInfo
 * @prop {string} subreddit The subreddit
 * @prop {"top" | "new" | "hot"} type The subreddit type
 * 
 * @typedef {import('../command').CommandInfo & RedditCommandInfo} IRedditCommand
 */