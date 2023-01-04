export const initialState = {
    username: '',
    password: '',
    rePassword: '',
    firstName: '',
    lastName: ''
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

        case 'CHANGE_RE_PASSWORD':
            return {
                ...state,
                rePassword: payload
            }
        
        case 'CHANGE_FIRST_NAME':
            return {
                ...state,
                firstName: payload
            }
        
        case 'CHANGE_LAST_NAME':
            return {
                ...state,
                lastName: payload
            }
        default:
            return state;
    }
}

export default reducer;