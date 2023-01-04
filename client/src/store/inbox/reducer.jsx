export const initialState = {
    messages: [],
    status: {
        isFreezeData: false
    }
}

const reducer = (state, action) => {
    const { type, payload } = action
    
    switch (type) {
        case 'ADD_MESSAGES':
            return {
                ...state,
                messages: [
                    ...state.messages,
                    ...payload,
                ]
            }
        
        case 'LOAD_NEW_MESSAGES':
            return {
                ...state,
                messages: [
                    ...payload,
                    ...state.messages,
                ]
            }
        
         case 'LOAD_INIT_MESSAGES':
            return {
                ...state,
                messages: [
                    ...payload,
                ]
            }
    
        case 'FREEZE_DATA':
            return {
                ...state,
                status: {
                    ...state.status,
                    isFreezeData: true
                }
            }
        
        case 'DELETE_MESSAGE':
            return {
                ...state,
                messages: state.messages.map(message => {
                    if (message.id === payload.id) return { ...message, deletedAt: payload.deletedAt, from: payload.from }
                    return message
                })
            }
        
        case 'REACT_MESSAGE':
            return {
                ...state,
                messages: state.messages.map(message => {
                    if (message.id === payload.messageId) {
                        return {
                            ...message,
                            reactions: [
                                ...message.reactions?.filter(reaction => reaction.from !== payload.from),
                                payload
                            ]
                        }
                    }
                    return message
                })
            }
        
        case 'REMOVE_REACTION':
            return {
                ...state,
                messages: state.messages.map(message => {
                    if (message.id === payload.messageId) {
                        return {
                            ...message,
                            reactions: [
                                ...message.reactions.filter(reaction => reaction.from !== payload.from),
                            ]
                        }
                    }
                    return message
                })
            }
        default:
            return state;
    }
}

export default reducer;