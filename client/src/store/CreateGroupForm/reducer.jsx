import DEFAULT_IMAGE from '~/assets/images/image_user_default.jpg'

export const initialState = {
    search: '',
    conversation: {
        name: 'Happy group!',
        avatar: {content: '', base64: DEFAULT_IMAGE},
        members: []
    },

    usersFound: []
}

const reducer = (state, action) => {
    const { type, payload } = action
    
    switch (type) {
        case 'CHANGE_INPUT':
            return {
                ...state,
                search: payload
            }
        
        case 'CHANGE_NAME_GROUP':
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    name: payload
                }
            }
        
        case 'CHANGE_AVATAR':
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    avatar: payload
                }
            }
        
        case 'ADD_FOUND_USERS':
            return {
                ...state,
                usersFound: payload
            }
        
        case 'INSERT_FOUND_USERS':
            return {
                ...state,
                usersFound: [
                    ...state.usersFound,
                    ...payload
                ]
            }
        
        case 'ADD_MEMBER':
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    members: [
                        ...state.conversation.members,
                        payload
                    ]
                }
            }
        
        case 'REMOVE_MEMBER':
            return {
                ...state,
                conversation: {
                    ...state.conversation,
                    members: state.conversation.members.filter(member => member.id !== payload.id)
                }
            }
        default:
            return state;
    }
}

export default reducer;