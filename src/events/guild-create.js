const Event = require('../core/event');

module.exports = class GuildCreatedEvent extends Event
{
    constructor(client)
    {
        super(client, 'guildCreate');
    }

    /**
     * Emit the `guildCreate` event
     * @param {import('eris').Guild} guild The guild
     */
    async emit(guild)
    {
        this.client.logger.info(`Joined ${guild.name} (${guild.id})`);
        const query = new this.client.database.models.guilds({ id: guild.id });
        query.save();
    }
};