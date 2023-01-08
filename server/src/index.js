const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const io = require('socket.io');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./entity').connectDatabase()

const app = express();
const server = http.createServer(app);
const initialRoutes = require('./routes');
const initSocket = require('./socket.io');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [process.env.CLIENT_URL],
  methods: ['POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  preflightContinue: true
}));

const sessionOption = {
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 86400 * 1000,
        secure: false,
        httpOnly: true,
    }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOption.cookie.secure = true // serve secure cookies
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

initialRoutes(app);
initSocket(app, io(server,{
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  }
}));

console.log('NODE_ENV:',app.get('env'))
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
})