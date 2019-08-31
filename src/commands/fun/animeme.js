const RedditCommand = require('../../core/commands/reddit');

module.exports = class AnimemeCommand extends RedditCommand
{
    constructor(client)
    {
        super(client, {
            command: 'animeme',
            description: 'Gives an random anime meme',
            category: 'Fun',
            subreddit: 'animemes',
            type: 'hot'
        });
    }

    /**
     * Runs the `animeme` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        return ctx.embed(await this.generate());
    }
};