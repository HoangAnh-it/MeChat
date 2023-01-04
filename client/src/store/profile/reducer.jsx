export const initialState = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    intro: ''
}

const reducer = (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
        case 'CHANGE': 
            return {
                ...state,
                [payload.type]: payload.value
            }
        
        default:
            return state;
    }
}

export default reducer;