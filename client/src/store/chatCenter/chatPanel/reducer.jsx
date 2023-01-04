export const initialState = {
    message: '',
    medias: []
}

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ADD_MEDIA':
            const isContained = state.medias.some(item => item.type === payload.type && item.base64 === payload.base64);
            return {
                ...state,
                medias : isContained ? state.medias : [...state.medias, payload]
            }
    
        case 'REMOVE_MEDIA':
            return {
                ...state,
                medias : state.medias.filter(item => item.base64 !== payload)
            }
        
        case 'CHANGE_MESSAGE':
            return {
                ...state,
                message: payload
            }
        
        case 'RESET_VALUE':
            return initialState;
        
        default:
            return state;
    }
}

export default reducer