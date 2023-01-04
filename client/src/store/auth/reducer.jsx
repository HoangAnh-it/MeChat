export const initialState = {
    isLoggedIn: false,
    user: {
        id: '',
        avatar: '',
        firstName: '',
        lastName: '',
    },
    accessToken: '',
    joinedRooms: []
}

const reducer = (state, action) => {
    const { type, payload } = action
    
    switch (type) {
        case 'LOGGED_IN':
            return {
                ...state,
                isLoggedIn: true,
                ...payload
            }
    
        default:
            return state;
    }
}

export default reducer;