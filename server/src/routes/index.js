const api = require('../config/api');
const authRouter = require('./auth');
const homeRouter = require('./home');
const userRouter = require('./user');

const initialRoutes = (app) => {
    app.use(api.auth, authRouter);
    app.use(api.home, homeRouter);
    app.use(api.user, userRouter);
}

module.exports = initialRoutes;
