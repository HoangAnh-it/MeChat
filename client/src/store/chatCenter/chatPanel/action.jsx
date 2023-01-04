export const addMedia = (payload) => {
    return {
        type: 'ADD_MEDIA',
        payload: payload
    }
}

export const removeMedia = (payload) => {
    return {
        type: 'REMOVE_MEDIA',
        payload: payload
    }
}

export const changeMessage = (input) => {
    return {
        type: 'CHANGE_MESSAGE',
        payload: input
    }
}

export const resetValue = () => {
    return {
        type: 'RESET_VALUE',
        payload: ''
    }
}