const Event = require('../core/event');

module.exports = class MessageReceivedEvent extends Event
{
    constructor(client)
    {
        super(client, 'messageCreate');
    }

    /**
     * Emits the `messageCreate` event
     * @param {import('eris').Message} msg The message
     */
    emit(msg)
    {
        this.client.manager.service.run(msg);
    }
};