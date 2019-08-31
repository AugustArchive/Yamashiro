module.exports = class YamashiroEvent
{
    /**
     * Create a new instance of Event interface
     * @param {import('./client')} client The client
     * @param {Emittable} event The event to emit
     */
    constructor(client, event)
    {
        this.client = client;
        this.event  = event;
    }

    async emit()
    {
        throw new SyntaxError(`[${this.constructor.name}] The class doesn't bind the "emit(...args: any[])" function.`);
    }
}

/**
 * @typedef {"ready" | "disconnect" | "callCreate" | "callRing" | "callDelete" | "callUpdate" | "channelCreate" | "channelDelete" | "channelPinUpdate" | "channelRecipientAdd"  | "channelRecepientRemove" | "channelUpdate" | "friendSuggestionCreate" | "friendSuggestionDelete" | "guildAvaliable" | "guildBanAdd" | "guildBanRemove" | "guildDelete" | "guildUnavaliable" | "guildCreate" | "guildEmojisUpdate" | "guildMemberAdd" | "guildMemberChunk" | "guildMemberRemove" | "guildMemberUpdate" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "hello" | "messageCreate" | "messageDeleteBulk" | "messageReactionRemoveAll" | "messageDeleteBulk" | "messageDelete" | "messageReactionAdd" | "messageReactionRemove" | "messageUpdate" | "presenceUpdate" | "rawWS" | "unknown" | "relationshipAdd" | "relationshipRemove" | "relationshipUpdate" | "typingStart" | "unavaliableGuildCreate" | "userUpdate" | "voiceChannelJoin" | "voiceChannelLeave" | "voiceChannelSwitch" | "voiceStateUpdate" | "warn" | "debug" | "shardDisconnect" | "error" | "shardPreReady" | "connect" | "shardReady" | "shardResume"} Emittable
 */