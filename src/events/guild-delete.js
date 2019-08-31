const Event = require('../core/event');

module.exports = class GuildDeletionEvent extends Event
{
    constructor(client)
    {
        super(client, 'guildDelete');
    }

    /**
     * Emits the `guildDelete` event
     * @param {import('eris').Guild} guild The guild that kicked Yamashiro
     */
    async emit(guild)
    {
        this.client.logger.warn(`Left ${guild.name} (${guild.id})`);
        this
            .client
            .database
            .models
            .guilds
            .findOne({ id: guild.id })
            .remove()
            .exec();
    }
};