const api = require('../config/api');
const authRouter = require('./auth');
const homeRouter = require('./home');
const userRouter = require('./user');
const conversationRouter = require('./conversation');

const initialRoutes = (app) => {
    app.use(api.auth, authRouter);
    app.use(api.home, homeRouter);
    app.use(api.user, userRouter);
    app.use(api.conversation, conversationRouter)
}

module.exports = initialRoutes;
