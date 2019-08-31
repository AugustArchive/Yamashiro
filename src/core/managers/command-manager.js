const { Collection } = require('eris');
const { readdirSync, readdir } = require('fs');
const CommandService = require('../services/command-service');

module.exports = class CommandManager
{
    /**
     * Create a new instance of the command manager
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client = client;
        /** @type {Collection<import('../command')>} */
        this.commands = new Collection();
        this.service = new CommandService(client);
    }

    /**
     * Start the command manager
     */
    async start()
    {
        const categories = await readdirSync(`${process.cwd()}/commands`);
        for (let i = 0; i < categories.length; i++) readdir(`${process.cwd()}/commands/${categories[i]}`, (error, files) => 
        {
            if (error) this.client.logger.error(error.stack);
            this.client.logger.info(`Building ${files.length} commands...`);
            files.forEach((f) => 
            {
                try {
                    const Command = require(`${process.cwd()}/commands/${categories[i]}/${f}`);
                    const command = new Command(this.client);
    
                    if (command.disabled) return;
                    if (this.commands.has(command.command)) return;

                    command.setParent(categories[i], f);
                    this.commands.set(command.command, command);
                    this.client.logger.info(`Successfully initialized command ${command.command}!`);
                } catch(ex) {
                    this.client.logger.error(`Cannot initalize the command:\n${ex.stack}`);
                }
            });
        });
    }
};