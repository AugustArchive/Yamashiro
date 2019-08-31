const { Schema, model } = require('mongoose');

/**
 * The user schema
 * @type {Schema<UserModel>}
 */
const schema = new Schema({
    userID: String,
    region: {
        type: String,
        default: 'USA'
    }
});

/**
 * The model
 * @type {import('mongoose').Model<UserModel, {}>}
 */
const _model = model('users', schema, 'users');

module.exports = _model;

/**
 * @typedef {Object} UserModel
 * @prop {string} userID The user ID
 * @prop {string} region The region
 */