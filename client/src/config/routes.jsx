const routes = {
    root: 'MeChat',

    public: {
        login: '/login',
        signup: '/signup',
    },

    private: {
        base: '/',
        home: '/home',
        profile: '/u/:id',
        toProfile: (id) => {
            return `/u/${id}`
        },

        chat: '/chat/:id',
        toInbox: (id) => {
            return `/chat/${id}`
        },

        friends: '/friends'
    }
}

export default routes;