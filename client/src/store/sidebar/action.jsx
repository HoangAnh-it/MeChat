export const handleDataChatPreview = (payload) => {
    return {
        type: 'HANDLE_CHAT_PREVIEW',
        payload: payload
    }
}

export const changeInputSearch = (inputSearch) => {
    return {
        type: 'CHANGE_INPUT_SEARCH',
        payload: inputSearch
    }
}

export const newMessage = (payload) => {
    return {
        type: 'NEW_MESSAGE',
        payload: payload
    }
}

export const newChat = (payload) => {
    return {
        type: 'NEW_CHAT',
        payload: payload
    }
}

export const deleteChat = (id) => {
    return {
        type: 'DELETE_CHAT',
        payload: id
    }
}

export const deleteMessage = (data) => {
    return {
        type: 'DELETE_MESSAGE',
        payload: data
    }
}