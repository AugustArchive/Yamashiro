const Command = require('../../core/commands/settings');

module.exports = class PrefixCommand extends Command
{
    constructor(client)
    {
        super(client, {
            command: 'setregion',
            description: 'Sets the region',
            usage: '<"na" | "eu" | "oceania" | "asia">',
            aliases: ['region'],
            type: 'user'
        });

        this.mutable = {
            regions: ['na', 'eu', 'asia', 'oceania'],
            regionObj: {
                na: 'USA',
                eu: 'Europe',
                asia: 'Asia',
                oceania: 'Australia'
            }
        };
    }

    /**
     * Runs the `setregion` command
     * @param {import('../../core/context')} ctx The command context
     */
    async execute(ctx)
    {
        const region = ctx.args.get(0);
        if (!region) return ctx.send('Admiral, you didn\'t provide a region! (' + this.mutable.regions.map(s => `\`${s}\``).join(', ') + ')');
        if (!this.mutable.regions.includes(region)) return ctx.send(`Admiral, you didn't provide a valid region. (${this.mutable.regions.map(s => `\`${s}\``).join(', ')})`);
        
        const x = this.mutable.regionObj[region];
        this
            .client
            .database
            .models['users']
            .updateOne({ userID: ctx.sender.id }, { $set: { region: x } }, (error) => {
                if (error) return ctx.send(`Admiral, I was unable to set your region to \`${x}\`. Sorry...`);
                return ctx.send(`Admiral, your region has been set to \`${x}\`! ${x === 'USA'? 'All date formats are `mm/dd/yyyy`': 'All date formats are `dd/mm/yyyy`'}!`);
            });
    }
}
