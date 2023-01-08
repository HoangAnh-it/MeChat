export const changeSearch = (input) => {
    return {
        type: 'CHANGE_INPUT',
        payload: input
    }
}

export const changeNameGroup = (input) => {
    return {
        type: 'CHANGE_NAME_GROUP',
        payload: input
    }
}

export const changeAvatar = (avatar) => {
    return {
        type: 'CHANGE_AVATAR',
        payload: avatar
    }
}

export const addFoundUsers = (data) => {
    return {
        type: 'ADD_FOUND_USERS',
        payload: data
    }
}

export const insertFoundUsers = (data) => {
    return {
        type: 'INSERT_FOUND_USERS',
        payload: data
    }
}

export const addMember = (user) => {
    return {
        type: 'ADD_MEMBER',
        payload: user
    }
}

export const removeMember = (user) => {
    return {
        type: 'REMOVE_MEMBER',
        payload: user
    }
}