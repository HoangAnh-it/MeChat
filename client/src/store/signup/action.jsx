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

export const handleOnChangeRePassword = (payload) => {
    return {
        type: 'CHANGE_RE_PASSWORD',
        payload: payload
    }
}

export const handleOnChangeFirstName = (payload) => {
    return {
        type: 'CHANGE_FIRST_NAME',
        payload: payload
    }
}

export const handleOnChangeLastName = (payload) => {
    return {
        type: 'CHANGE_LAST_NAME',
        payload: payload
    }
}