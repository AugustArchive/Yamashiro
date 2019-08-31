const Event = require('../core/event');

module.exports = class ShardDisconnectedEvent extends Event
{
    constructor(client)
    {
        super(client, 'shardDisconnect');
    }

    /**
     * Emits the `shardDisconnect` event
     * @param {Error} error The error, if any
     * @param {Number} id The shard ID that was disconnected
     */
    emit(error, id)
    {
        this.client.logger.warn(`Shard #${id} was disconnected:\n${error? error.stack: 'None'}`);
    }
};