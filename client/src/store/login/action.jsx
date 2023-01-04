export const handleOnChangeUsername = (payload) => {
    return {
        type: 'CHANGE_USER_NAME',
        payload: payload
    }
}

export const handleOnChangePassword = (payload) => {
    return {
        type: 'CHANGE_PASSWORD',
        payload: payload
    }
}