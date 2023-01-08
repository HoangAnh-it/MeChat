const routes = {
    root: 'MeChat',

    public: {
        login: '/login',
        signup: '/signup',
    },

    private: {
        base: '/',
        home: '/',
        profile: '/u/:id',
        toProfile: (id) => {
            return `/u/${id}`
        },

        groupDetail: '/g/:id',
        toGroupDetail: (id) => {
            return `/g/${id}`
        },

        chat: '/chat/:id',
        toInbox: (id) => {
            return `/chat/${id}`
        },

        friends: '/friends',
        group_create: '/group/create'
    }
}

export default routes;