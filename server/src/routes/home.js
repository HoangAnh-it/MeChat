const router = require('express').Router();

const api = require('../config/api');
const homeController = require('../controller/homeController');
const { authenticate } = require('../middleware');

router.get(api.chatPreview, authenticate, homeController.allConversations);

module.exports = router;
