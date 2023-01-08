const router = require('express').Router();

const api = require('../config/api');
const conversationController = require('../controller/conversationController');
const { authenticate } = require('../middleware');

router.get(api.conversationDetail, authenticate, conversationController.getDetail);
router.post(api.createConversation, authenticate, conversationController.createConversation)
router.delete(api.deleteConversation, authenticate, conversationController.deleteConversation)
router.patch(api.updateConversation, authenticate, conversationController.update)
router.post(api.addUserToConversation, authenticate, conversationController.addUser)
router.delete(api.deleteUserFromConversation, authenticate, conversationController.deleteUser)

module.exports = router;
