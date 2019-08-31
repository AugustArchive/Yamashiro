const RedditCommand = require('../../core/commands/reddit');

module.exports = class AwwnimeCommand extends RedditCommand
{
    constructor(client)
    {
        super(client, {
            command: 'awwnime',
            description: 'Gives an random image from "r/awwnime"!',
            category: 'Fun',
            subreddit: 'awwnime',
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