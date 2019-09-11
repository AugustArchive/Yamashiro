const ArgumentParser   = require('./parsers/argument-parser');
const MessageCollector = require('./message-collector');

module.exports = class CommandContext
{
    /**
     * Create a new instance of the command context
     * @param {import('./client')} client The client
     * @param {import('eris').Message} message The message
     * @param {string[]} args The arguments provided by the sender
     */
    constructor(client, message, args)
    {
        Object.assign(this, message);
        this.client = client;
        this.message = message;
        this.args = new ArgumentParser(args);
        this.collector = new MessageCollector(client);
    }

    /**
     * Gets the guild
     * @returns {import('eris').Guild} The guild instance
     */
    get guild()
    {
        return this.message.channel.guild;
    }

    /**
     * Gets the author
     * @returns {import('eris').User} THe user
     */
    get sender()
    {
        return this.message.author;
    }

    /**
     * Gets the current user's member facility
     */
    get member()
    {
        return this.guild.members.get(this.sender.id);
    }

    /**
     * Sends a message to a channel
     * @param {string} content The content to send
     */
    send(content)
    {
        return this.message.channel.createMessage(content);
    }

    /**
     * Sends an embed to a channel
     * @param {import('eris').EmbedOptions} e The embed
     */
    embed(e)
    {
        return this.message.channel.createMessage({
            embed: e
        });
    }
};