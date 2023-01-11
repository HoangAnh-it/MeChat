module.exports = {
    auth: '/api',
    login: '/login',
    logout: '/logout',
    signup: '/signup',
    authenticate: '/authenticate',
    
    // home
    home: '/api/home',
    chatPreview: '/chat_preview',
    
    // user
    user: '/api/user',
    basicInfo: '/basic_info/:id',
    basicMultipleInfo: '/basic_multiple_info/:ids',
    profile: '/profile/:id',
    updateProfile: '/profile_update/:id',
    messages: '/messages/get/:id',
    sendMessages: '/messages/send',
    deleteMessage: '/m/delete/:id',
    get: '/get',
    reactMessage: '/react_message',
    removeReaction: '/remove_reaction/:id',
    leftGroup: '/left_group',
    
    // conversation
    conversation: '/api/c',
    deleteConversation: '/delete/:id',
    createConversation: '/create',
    conversationDetail: '/detail/:id',
    updateConversation: '/update',
    addUserToConversation: '/add-user',
    deleteUserFromConversation: '/delete-user',
}