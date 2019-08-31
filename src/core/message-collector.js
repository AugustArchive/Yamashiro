module.exports = class MessageCollector
{
    /**
     * Create a new instance of the Message Collector
     * @param {import('./client')} client The client
     */
    constructor(client)
    {
        /**
         * The collectors
         * @type {Collector}
         */
        this.collectors = {};

        client.on('messageCreate', this.verify.bind(this));
    }

    /**
     * Verifies the message
     * @param {import('eris').Message} msg The message
     */
    verify(msg)
    {
        if (!msg.author) return;

        const collector = this.collectors[`${msg.author.id}:${msg.channel.id}`];
        if (collector && collector.filter(msg)) collector.accept(msg);
    }

    /**
     * Await an message
     * @param {(msg: import('eris').Message) => boolean} filter The filter
     * @param {AwaitMessageInfo} info InforMATION!!!!
     * @returns {Promise<import('eris').Message>} The mESSaGe
     */
    awaitMessage(filter, info = { channelID, userID, timeout })
    {
        return new Promise((accept) => {
            if (this.collectors[`${info.channelID}:${info.userID}`]) delete this.collectors[`${info.channelID}:${info.userID}`];
            this.collectors[`${info.channelID}:${info.userID}`] = { accept, filter };
            let timeout = info.timeout || 30;
            setTimeout(accept.bind(null, false), timeout * 1000);
        });
    }
};

/**
 * @typedef {Object} ICollector
 * @prop {(msg: import('eris').Message) => boolean} filter The filter
 * @prop {(value?: import('eris').Message | PromiseLike<import('eris').Message>) => void} accept The accept function
 * 
 * @typedef {Object} AwaitMessageInfo
 * @prop {string} channelID The channel ID
 * @prop {string} userID The user ID
 * @prop {number} [timeout=30] The timeout in seconds
 * 
 * @typedef {Object<string, ICollector>} Collector
 */