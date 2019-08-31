const { readdir }  = require('fs');
const EventService = require('../services/event-service');

module.exports = class EventManager
{
    /**
     * Create a new instance of the event manager
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client  = client;
        this.service = new EventService(client);
    }

    /**
     * Start the event manager
     */
    start()
    {
        readdir(`${process.cwd()}/events`, (error, files) => 
        {
            if (error) this.client.logger.error(error.stack);
            this.client.logger.info(`Building ${files.length} events...`);
            files.forEach((f) => 
            {
                const Event = require(`${process.cwd()}/events/${f}`);
                const event = new Event(this.client);

                this.service.run(event);
            });
        });
    }
};