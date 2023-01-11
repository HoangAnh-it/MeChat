const api = {
    login: '/api/login',
    signup: '/api/signup',
    logout: '/api/logout',
    authenticate: '/api/authenticate',

    // home
    chatPreview: '/api/home/chat_preview',
    
    //user
    updateProfile: (id) => `/api/user/profile_update/${id}`,
    getProfile: (id) => `/api/user/profile/${id}`,
    basicInfo: (id) => `/api/user/basic_info/${id}`,
    basicMultipleInfo: (ids) => `/api/user/basic_multiple_info/${JSON.stringify(ids)}`,

    deleteMessage: (id) => `/api/user/m/delete/${id}`,
    
    // message
    getMessages: (conversationId) => `/api/user/messages/get/${conversationId}`,
    
    sendMessage: function(type, conversationId, friendId) {
        return `/api/user/messages/send?c=${conversationId ?? ''}&t=${type ?? ''}&id=${friendId ?? ''}`
    },

    findFriends: (search, options) => {
        const query = Object.keys(options).map(key => `${key}=${JSON.stringify(options[key])}`).join('&');
        return `/api/user/get?search=${search}&${query}`
    },

    reactMessage: (messageId) => {
        return `/api/user/react_message?messageId=${messageId}`
    },

    removeReaction: (reactionId) => {
        return `/api/user/remove_reaction/${reactionId}`
    },

    leftGroup: 'api/user/left_group',

    // conversation
    conversationCreation: '/api/c/create',
    deleteConversation: (id) => `/api/c/delete/${id}`,
    conversationDetail: (id) => `/api/c/detail/${id}`,
    updateConversation: (id) => `/api/c/update?id=${id}`,
    addUserToConversation: (id) => `/api/c/add-user?id=${id}`,
    deleteUserFromConversation: (conversationId, userId) => `/api/c/delete-user?id=${conversationId}&userId=${userId}`
}

export default api;