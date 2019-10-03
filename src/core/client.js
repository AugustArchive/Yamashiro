const { Client } = require('eris');
const CommandManager = require('./managers/command-manager');
const EventManager = require('./managers/event-manager');
const DatabaseService = require('./services/database-service');
const EmbedBuilder = require('../util/embed-builder');
const RedditFeed = require('./feed/reddit-feed');
const { humanize } = require('@yamashiro/modules');
const RESTClient = require('./rest');
const Pikmin = require('pikmin');

module.exports = class YamashiroClient extends Client
{
    /**
     * Create a new instance of the Yamashiro client
     */
    constructor()
    {
        super(process.env.YAMASHIRO_TOKEN, {
            disableEveryone: true,
            autoreconnect: true,
            maxShards: 'auto',
            getAllUsers: true,
            defaultImageFormat: 'png'
        });

        this.manager   = new CommandManager(this);
        this.events    = new EventManager(this);
        this.database  = new DatabaseService(this);
        this.constants = require('../util/constants');
        this.util      = require('../util/util');
        this.logger    = new Pikmin.instance({
            name: 'main',
            format: `${Pikmin.colors.bgMagentaBright(process.pid)} ${Pikmin.colors.bgCyanBright('%h:%m:%s')} [${Pikmin.colors.magenta('%l')}] <=> `,
            autogen: false,
            transports: [
                new Pikmin.ConsoleTransport({ name: 'info', process: process, format: `${Pikmin.colors.bgMagentaBright(process.pid)} ${Pikmin.colors.bgCyanBright('%h:%m:%s')} [${Pikmin.colors.cyan('%l')}] <=> ` }),
                new Pikmin.ConsoleTransport({ name: 'error', process: process, format: `${Pikmin.colors.bgMagentaBright(process.pid)} ${Pikmin.colors.bgCyanBright('%h:%m:%s')} [${Pikmin.colors.red('%l')}] <=> ` }),
                new Pikmin.ConsoleTransport({ name: 'discord', process: process, format: `${Pikmin.colors.bgMagentaBright(process.pid)} ${Pikmin.colors.bgCyanBright('%h:%m:%s')} [${Pikmin.colors.magenta('%l')}] <=> ` }),
                new Pikmin.ConsoleTransport({ name: 'warn', process: process, format: `${Pikmin.colors.bgMagentaBright(process.pid)} ${Pikmin.colors.bgCyanBright('%h:%m:%s')} [${Pikmin.colors.yellow('%l')}] <=> ` })
            ]
        });
        this.rest              = new RESTClient(this);
        this.package           = require('../../package.json');
        this.admins            = ['280158289667555328', '359794248570109972'];
        this.commandUsage      = {};
        this.commandsExecution = 0;
        this.messagesSeen      = 0;
    }

    /**
     * Start the bot
     */
    async build()
    {
        this.manager.start();
        this.events.start();
        this.database.connect();
        await this
            .connect()
            .then(() => this.logger.discord('Yamashiro is now connected to Discord via WS...'));
    }

    /**
     * Redact private information
     * @param {string} str The result from the eval or exec commands
     * @returns {string} The tokens truncated as `--snip--`
     */
    redact(str) {
        const regex = new RegExp([
            process.env.YAMASHIRO_TOKEN,
            process.env.PPY,
            this.token
        ].join('|'), 'gi');
        return str.replace(regex, '--snip--');
    }

    startRedditFeeds()
    {
        this.guilds.forEach(async() => {
            const stream = await this.database.models['guilds'].find({ 'reddit.enabled': true }).cursor();
            stream.on('data', gui => {
                const reddit = new RedditFeed(this, `/r/${gui.reddit.subreddit}`);
                reddit.start(gui.reddit.channelID, 60000);
            });
        });
    }

    getUptime()
    {
        return humanize(Date.now() - this.startTime);
    }

    /**
     * Gets the embed builder
     */
    getEmbed()
    {
        return new EmbedBuilder().setColor(this.constants.COLOR);
    }

    /**
     * Gets the statistics of Yamashiro
     */
    getStats()
    {
        const os   = require('os');
        const cpus = os.cpus();

        return {
            guilds: this.guilds.size.toLocaleString(),
            users: this.users.size.toLocaleString(),
            channels: Object.keys(this.channelGuildMap).length.toLocaleString(),
            shards: this.shards.size,
            uptime: this.getUptime(),
            memoryUsage: `${this.util.formatBytes(process.memoryUsage().heapUsed)}/${this.util.formatBytes(os.totalmem())} (${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(2)}%)`,
            versions: {
                yamashiro: this.package.version,
                eris: require('eris').VERSION,
                node: process.version
            },
            dependencies: Object.keys(this.package.dependencies).map(dep => dep),
            platform: {
                arch: os.arch()? os.arch(): '32x',
                release: os.release()? os.release(): '?.?.?',
                platform: this.util.parsePlatform(os.platform())
            },
            cpu: cpus.length
        };
    }
};
