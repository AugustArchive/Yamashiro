const mongoose = require('mongoose');

/**
 * Schema
 * @type {mongoose.Schema<GuildModel>}
 */
const schema = new mongoose.Schema({
    id: String,
    prefix: {
        type: String,
        default: process.env.YAMASHIRO_PREFIX
    },
    logging: {
        enabled: {
            type: Boolean,
            default: false
        },
        channelID: {
            type: String,
            default: null
        }
    },
    reddit: {
        enabled: {
            type: Boolean,
            default: false
        },
        channelID: {
            type: String,
            default: null
        },
        subreddit: {
            type: String,
            default: null
        }
    }
});

/**
 * Model instance
 * @type {mongoose.Model<GuildModel, {}>}
 */
const _model = mongoose.model('guilds', schema, 'guilds');

module.exports = _model;

/**
 * @typedef {Object} GuildModel
 * @prop {string} id The guild ID
 * @prop {string} prefix The guild prefix
 * @prop {NormalSetting} logging Logging utility
 * @prop {Reddit} reddit Reddit feed feature
 * 
 * @typedef {Object} NormalSetting
 * @prop {boolean} enabled If the modlog is enabled (default: false)
 * @prop {string} channelID The channel ID to send embeds to
 * 
 * @typedef {Object} Reddit
 * @prop {boolean} enabled If the reddit feed is enabled
 * @prop {string} channelID The channel ID to send it to
 * @prop {string} subreddit The subreddit
 */