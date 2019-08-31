const Event = require('../core/event');

module.exports = class ShardReadyEvent extends Event
{
    constructor(client)
    {
        super(client, 'shardReady');
    }

    /**
     * Emits the `shardReady` event
     * @param {Number} id The shard ID
     */
    emit(id)
    {
        this.client.logger.info(`Shard #${id} has connected to Discord...`);
    }
};