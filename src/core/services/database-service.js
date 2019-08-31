const mongoose = require('mongoose');

module.exports = class DatabaseService
{
    /**
     * Create a new instance of the database service
     * @param {import('../client')} client The client instance
     */
    constructor(client)
    {
        this.client = client;
        this.models = {
            guilds: require('../../models/guild'),
            users: require('../../models/user')
        };
    }

    /**
     * Connects to the database
     */
    async connect()
    {
        await mongoose.connect('mongodb://localhost:27017/Yamashiro', { useNewUrlParser: true });
        mongoose.connection.on('error', (error) => this.client.logger.error(error));
        this.client.logger.info('Connected to MongoDB');
    }

    /**
     * Destroys the database
     */
    destroy()
    {
        const trace = { success: false, error: null };
        try {
            mongoose.connection.close(() => trace.success = true);
        } catch(ex) {
            trace.error = ex.message;
        }
        this.client.logger.warn(`Disconnected from MongoDB!\nTrace:\n${require('util').inspect(trace)}`);
    }

    /**
     * Gets the guild
     * @param {string} id The ID
     * @returns {Promise<import('../../src/models/guild').GuildModel>}
     */
    async getGuild(id)
    {
        const guild = await this.models['guilds'].findOne({ id }).lean().exec();
        if (!guild || guild === null)
        {
            const query = new this.models.guilds({ id });
            query.save();
            return query;
        }

        return guild;
    }

    /**
     * Gets the user
     * @param {string} id The ID
     * @returns {Promise<import('../../src/models/user').UserModel>}
     */
    async getUser(id)
    {
        const user = await this.models.users.findOne({ userID: id }).lean().exec();
        if (!user || user == null)
        {
            const query = new this.models.users({ userID: id });
            query.save();
            return query;
        }

        return user;
    }
};