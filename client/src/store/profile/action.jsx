export const change = (type, value) => {
    return {
        type: 'CHANGE',
        payload: {type, value}
    }
}