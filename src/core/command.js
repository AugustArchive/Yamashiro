const EmbedBuilder = require('../util/embed-builder');

module.exports = class YamashiroCommand
{
    /**
     * Create a new instance of the Yamashiro command
     * @param {import('./client')} client The client
     * @param {CommandInfo} info The command options
     */
    constructor(client, info)
    {
        /**
         * The client instance
         */
        this.client = client;

        /**
         * The command name
         */
        this.command = info.command;

        /**
         * The command description
         */
        this.description = info.description;

        /**
         * The command usage (Use `YamashiroCommand#format` to prettify the command usage)
         */
        this.usage = info.usage || '';

        /**
         * The aliases
         */
        this.aliases = info.aliases || [];

        /**
         * The command category
         */
        this.category = info.category || 'Generic';

        /**
         * If the command should be ran in a guild
         */
        this.guildOnly = info.guildOnly || false;

        /**
         * If the command shoudld be executed by the owners
         */
        this.ownerOnly = info.ownerOnly || false;

        /**
         * If the command should be hidden from the help command
         */
        this.hidden = info.hidden || false;

        /**
         * If the command shouldn't be added to the collection
         */
        this.disabled = info.disabled || false;

        /**
         * The command throttle
         */
        this.throttle = info.throttle || 3;
        
        /**
         * The parent
         * @type {string}
         */
        this.parent = null;

        /**
         * The user permissions
         * @type {string[]}
         */
        this.userPermissions = info.userPermissions || [];
    }

    /**
     * Sets the parent
     * @param {string} category The category
     * @param {string} file The file
     */
    setParent(category, file)
    {
        this.parent = `${category}:${file}`;
        return this;
    }

    /**
     * Run the command
     * @param {import('./context')} context The command context
     */
    async run(context)
    {
        return context.send(`The command \`${this.command}\` is disabled due to no functionality.`);
    }

    /**
     * Prettify the command usage
     */
    format()
    {
        return `${process.env.YAMASHIRO_PREFIX}${this.command}${this.usage? ` ${this.usage}`: ''}`;
    }

    /**
     * Parses all flags
     * @param {string[]} args The command arguments
     * @returns {Object<string, string|boolean>} An object as `{ arg: val }`
     */
    parseFlags(args)
    {
        const parsed = {};
        for (let i = 0; i < args.length; i++)
        {
            const arg = args[i];
            this.flags.forEach(() => {
                if (!arg.includes('--')) return;
                parsed[arg.split('--')[1].split('=')[0].toLowerCase()] = arg.includes('=')? arg.split('=')[1]: true;
            });
        }
        return parsed;
    }

    /**
     * Generates the help embed
     */
    generateHelp()
    {
        const embed = new EmbedBuilder()
            .setTitle(`Command ${this.command}`)
            .setDescription(typeof this.description === 'function'? this.description(this.client): this.description)
            .setColor(this.client.constants.COLOR)
            .addField('Syntax', this.format(), true)
            .addField('Category', this.category, true)
            .addField('Aliases', this.aliases.length > 0? `\`${this.aliases.join('`, `')}\``: 'None', true)
            .addField('Guild Only', this.guildOnly? 'True': 'False', true)
            .addField('Owner Only', this.ownerOnly? 'True': 'False', true)
            .addField('User Permissions', this.userPermissions.length > 0? this.userPermissions.join(', '): 'None', true);
            
        return embed.build();
    }
};

/**
 * @typedef {Object} CommandInfo
 * @prop {string} command The command name
 * @prop {string|((client: import('./client')) => string)} description The description of the command
 * @prop {string} [usage] The command syntax, use `YamashiroCommand#format` to format the command
 * @prop {string[]} [aliases=[]] The command aliases, returns an empty array if none were provided
 * @prop {string} [category="Generic"] The command category, returns `Generic` since the generic categorial commands won't specify the category
 * @prop {boolean} [guildOnly=false] If the command should be ran in a Discord guild
 * @prop {boolean} [ownerOnly=false] If the command should be ran by me
 * @prop {boolean} [hidden=false] If the command should be hidden from the help command
 * @prop {boolean} [disabled=false] If the command shouldn't be added to the collection
 * @prop {number} [throttle=3] The command throttle
 * @prop {string[]} [flags=[]] The command flags
 * @prop {string[]} [userPermissions=[]] User permissions
 */