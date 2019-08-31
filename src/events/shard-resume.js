const Event = require('../core/event');

module.exports = class ShardResumedEvent extends Event
{
    constructor(client)
    {
        super(client, 'shardResume');
    }

    /**
     * Emits the `shardResume` event
     * @param {Number} id The shard ID
     */
    emit(id)
    {
        this.client.logger.info(`Shard #${id} has resumed!`);
    }
};