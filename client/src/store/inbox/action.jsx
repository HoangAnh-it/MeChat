export const addMessages = (payload) => {
    return {
        type: 'ADD_MESSAGES',
        payload
    }
}

export const freezeData = () => {
    return {
        type: 'FREEZE_DATA',
        payload: null
    }
}

export const loadNewMessages = (payload) => {
    return {
        type: 'LOAD_NEW_MESSAGES',
        payload
    }
}

export const loadInitMessages = (payload) => {
    return {
        type: 'LOAD_INIT_MESSAGES',
        payload
    }
}

export const deleteMessage = (data) => {
    return {
        type: 'DELETE_MESSAGE',
        payload: data
    }
}

export const reactMessage = (reaction) => {
    return {
        type: 'REACT_MESSAGE',
        payload: reaction
    }
}

export const removeReaction = (data) => {
    return {
        type: 'REMOVE_REACTION',
        payload: data
    }
}