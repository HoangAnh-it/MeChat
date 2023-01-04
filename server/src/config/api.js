module.exports = {
    auth: '/api',
    login: '/login',
    logout: '/logout',
    signup: '/signup',
    authenticate: '/authenticate',
    
    home: '/api/home',
    conversation: '/c',
    deleteConversation: '/c/delete/:id',

    user: '/api/user',
    basicInfo: '/basic_info/:id',
    basicMultipleInfo: '/basic_multiple_info/:ids',
    profile: '/profile/:id',
    updateProfile: '/profile_update/:id',
    messages: '/messages',
    deleteMessage: '/m/delete/:id',
    get: '/get',
    reactMessage: '/react_message',
    removeReaction: '/remove_reaction/:id',
}