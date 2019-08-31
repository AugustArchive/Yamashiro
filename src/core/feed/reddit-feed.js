const { Collection } = require('eris');
const w = require('wumpfetch');

module.exports = class RedditFeed
{
    /**
     * Create a new instance of the reddit feed instance
     * @param {import('../client')} client The client instance
     * @param {string} subreddit The subreddit
     */
    constructor(client, subreddit)
    {
        this.client    = client;
        this.url       = `https://www.reddit.com${subreddit}`;
        /** @type {Collection<DateCache>} */
        this.dates     = new Collection();
        /** @type {IntervalObject} */
        this.intervals = {};
    }

    /**
     * Validates the reddit
     */
    async validate()
    {
        const res = await w({
            url: `${this.url}/about.json`,
            method: 'GET',
            parse: 'json'
        }).send();
        const data = res.body.data;

        if (data.error === 404 || data.error === 403 || data.over18) return false;
        else return true;
    }

    /**
     * Starts the reddit feed
     * @param {string} channelID The channel ID
     * @param {number} ratelimit The ratelimit in milliseconds
     */
    async start(channelID, ratelimit)
    {
        const reddit = await this.validate();
        if (reddit) this.intervals[channelID] = setInterval(async() => {
            const req = await w({
                url: `${this.url}/hot.json?limit=1`,
                method: 'GET'
            }).query('limit', 100).send();
            const body = req.json();

            if (!body.data.children.length) {
                this.client.logger.error('Unable to find posts in subreddit: ' + this.url);
                return null;
            }

            const posts = body.data.children.filter(p => {
                if (!p.data) return false;
                // TODO: If the channel is NSFW, return true
                if (p.data.over_18) return false;
                return p.data.url && p.data.title;
            });

            if (!posts.length) {
                this.client.logger.error('No posts found in subreddit: ' + this.url);
                return null;
            }

            const post = posts[Math.floor(Math.random() * posts.length)].data;
            await this.client.createMessage(channelID, {
                embed: this
                    .client
                    .getEmbed()
                    .setTitle(post.title)
                    .setImage(post.post_hint === 'image'? post.url: null)
                    .setDescription(post.post_hint !== 'image' && post.selftext.length <= 2000? this.client.util.elipisis(post.selftext, 1350): post.selftext)
                    .setTimestamp()
                    .setFooter(`${this.client.util.formatNumber(post.ups)} upvotes`, this.client.users.get(this.client.admins[0]).avatarURL)
            });
            this.dates.has(channelID)? this.dates.get(channelID).last++: null;
        }, ratelimit);
    }
};

/**
 * @typedef {Object} DateCache
 * @prop {number} last The last cached date
 * 
 * @typedef {Object<string, NodeJS.Timeout>} IntervalObject
 */