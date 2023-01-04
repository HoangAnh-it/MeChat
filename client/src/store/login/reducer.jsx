export const initialState = {
    username: '',
    password: '',
}

const reducer = (state, action) => {
    const { type, payload } = action
    
    switch (type) {
        case 'CHANGE_USER_NAME':
            return {
                ...state,
                username: payload
            }
    
        case 'CHANGE_PASSWORD':
            return {
                ...state,
                password: payload
            }
        default:
            return state;
    }
}

export default reducer;