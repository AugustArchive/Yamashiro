module.exports = class EventService
{
    /**
     * Create a new instance of the event service
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client = client;
    }

    /**
     * Run the event
     * @param {import('../event')} event The event
     */
    run(event)
    {
        const func = async(...args) =>
        {
            try {
                await event.emit(...args);
            } catch(ex) {
                this.client.logger.error(`Unable to run the ${event.event} event:\n${ex.stack}`);
            }
        };

        this.client.on(event.event, func);
    }
};