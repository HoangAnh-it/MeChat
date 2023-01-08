const router = require('express').Router();

const api = require('../config/api');
const userController = require('../controller/userController');
const { authenticate } = require('../middleware');

router.get(api.profile, authenticate, userController.profile);
router.get(api.basicInfo, authenticate, userController.basicInfo);
router.get(api.basicMultipleInfo, authenticate, userController.basicMultipleInfo);
router.get(api.messages, authenticate, userController.getMessages)
router.post(api.sendMessages, authenticate, userController.sendMessages)

router.delete(api.deleteMessage, authenticate, userController.deleteMessage)
router.patch(api.updateProfile, authenticate, userController.updateProfile)
router.get(api.get, authenticate, userController.getUsers)
router.post(api.reactMessage, authenticate, userController.reactMessage)
router.delete(api.removeReaction, authenticate, userController.removeReaction)

module.exports = router;
