class Activites
{
    constructor()
    {
        /**
         * The statuses to randomize
         * @type {ActivityStatus[]}
         */
        this.statuses = [
            {
                name: 'anime',
                type: 'WATCHING'
            },
            {
                name: 'with {{guilds}} Guilds',
                type: 'PLAYING'
            },
            {
                name: 'with {{users}} Users',
                type: 'PLAYING'
            },
            {
                name: 'Azur Lane',
                type: 'PLAYING'
            },
            {
                name: 'weeb music',
                type: 'LISTENING'
            },
            {
                name: 'osu!',
                type: 'PLAYING'
            },
            {
                name: 'Minecraft',
                type: 'PLAYING'
            },
            {
                name: 'Sakura Empire',
                type: 'WATCHING'
            },
            {
                name: 'YouTube',
                type: 'WATCHING'
            },
            {
                name: 'Spotify',
                type: 'LISTENING'
            },
            {
                name: 'on Shard #{{shard}}',
                type: 'PLAYING'
            },
            {
                name: 'dont expect shit to work',
                type: 'LISTENING'
            }
        ];
        this.types = {
            PLAYING: 0,
            LISTENING: 2,
            WATCHING: 3
        };
    }

    handle()
    {
        const status = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        return {
            name: status.name,
            type: this.types[status.type]
        };
    }
}

module.exports = new Activites();

/**
 * @typedef {Object} ActivityStatus
 * @prop {string} name The game status
 * @prop {"PLAYING" | "WATCHING" | "LISTENING"} type The status
 */