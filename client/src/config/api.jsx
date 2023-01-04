const api = {
    login: '/api/login',
    signup: '/api/signup',
    logout: '/api/logout',
    authenticate: '/api/authenticate',

    // home
    conversation: '/api/home/c',
    
    //user
    updateProfile: (id) => `/api/user/profile_update/${id}`,
    getProfile: (id) => `/api/user/profile/${id}`,
    basicInfo: (id) => `/api/user/basic_info/${id}`,
    basicMultipleInfo: (ids) => `/api/user/basic_multiple_info/${JSON.stringify(ids)}`,

    deleteConversation: (id) => `/api/user/c/delete/${id}`,
    deleteMessage: (id) => `/api/user/m/delete/${id}`,

    // message
    getMessages: (friendId) => `/api/user/messages?otherId=${friendId}`,
    
    sendMessage: function(type, conversationId, friendId) {
        return `/api/user/messages?c=${conversationId ?? ''}&t=${type ?? ''}&id=${friendId ?? ''}`
    },

    findFriends: (search, options) => {
        const query = Object.keys(options).map(key => `${key}=${options[key]}`).join('&');
        return `/api/user/get?search=${search}&${query}`
    },

    reactMessage: (messageId) => {
        return `/api/user/react_message?messageId=${messageId}`
    },

    removeReaction: (reactionId) => {
        return `/api/user/remove_reaction/${reactionId}`
    }
}

export default api;