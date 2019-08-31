const Command = require('../../core/command');
const wump = require('wumpfetch');

module.exports = class XKCDCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'xkcd',
            description: 'Grabs an random comic from XKCD',
            usage: '<comicID>',
            aliases: ['comic'],
            category: 'Fun'
        });
    }

    /**
     * Runs the `xkcd` command
     * @param {import('../../core/context')} ctx The command context
     */
    async run(ctx)
    {
        if (ctx.args.isEmpty(0))
        {
            const result = await wump({
                url: 'https://xkcd.com/info.0.json',
                method: 'GET'
            }).send();
            const data = result.json();

            const random = Math.floor(Math.random() * data.num) + 1;
            const comic = await wump({
                url: `https://xkcd.com/${random}/info.0.json`,
                method: 'GET'
            }).send();
            const com = comic.json();

            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle(com.safe_title)
                    .setDescription(com.alt)
                    .setImage(com.img)
                    .build()
            );
        } else {
            const arg = ctx.args.get(0);
            if (isNaN(arg)) return ctx.send(`Admiral, the comic number must be a number`);
            if (Number(arg) < 1) return ctx.send(`The comic number must be greater or equal to \`1\`.`);

            const res = await wump({
                url: 'https://xkcd.com/info.0.json',
                method: 'GET'
            }).send();
            const da = res.json();

            if (Number(arg) > da.num) return ctx.send(`Admiral, the comic number needs to be less or equal to \`${da.num}\`.`);
            const resu = await wump({
                url: `https://xkcd.com/${Number(arg)}/info.0.json`,
                method: 'GET'
            }).send();
            const dat = resu.json();

            return ctx.embed(
                this
                    .client
                    .getEmbed()
                    .setTitle(dat.safe_title)
                    .setDescription(dat.alt)
                    .setImage(dat.img)
                    .build()
            );
        }
    }
};