export const initialState = {
    searchInput: '',
    chats: [
        /**
         * {
        "conversationId",
        "conversationType",
        "conversationName",
        "conversationAvatar",
        "users": [
                { "id", "firstName", "lastName", "avatar" }
            ]
        }

        "lastMessage":{id, from , content, type}
         */
    ]
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case 'HANDLE_CHAT_PREVIEW':
            payload.sort((a, b) => {
                return (new Date(b.lastMessage.sentDateTime).getTime() - new Date(a.lastMessage.sentDateTime).getTime())
            })
            return {
                ...state,
                chats: payload
            }
        
        case 'CHANGE_INPUT_SEARCH':
            return {
                ...state,
                searchInput: payload
            }
        
        case 'NEW_CHAT': // payload = {lastMessage, ...conversation, users=[]}
            const newChat = {
                conversationId: payload.id,
                conversationType: payload.type,
                conversationName: payload.name,
                conversationAvatar: payload.avatar,
                users: payload.users,
                lastMessage: payload.lastMessage
            };
            return {
                ...state,
                chats: [
                    newChat,
                    ...state.chats
                ]
            }

        case 'NEW_MESSAGE': {
            // payload is [messages: [], conversationId]
            const existingChat = state.chats.find(chat => chat.conversationId === payload.conversationId);
            if (!existingChat) {
                return state;
            }
            existingChat.lastMessage = payload.messages[payload.messages.length - 1]
            return {
                ...state,
                chats: [
                    existingChat,
                    ...state.chats.filter(chat => chat.conversationId !== existingChat.conversationId)
                ]
            }
        }
        
        case 'DELETE_CHAT':
            return {
                ...state,
                chats: [
                    ...state.chats.filter(chat => chat.conversationId !== payload)
                ]
            }
        
        case 'DELETE_MESSAGE': {
            const existingChat = state.chats.find(chat => chat.conversationId === payload.conversationId);
            if (!existingChat) {
                return state;
            }
            existingChat.lastMessage.content = `Unsent a message.`
            existingChat.lastMessage.from = payload.from;
            return {
                ...state,
                chats: [
                    existingChat,
                    ...state.chats.filter(chat => chat.conversationId !== existingChat.conversationId)
                ]
            }
        }
        default:
            return state;
    }
}

export default reducer;