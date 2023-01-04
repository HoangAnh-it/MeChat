const router = require('express').Router();

const api = require('../config/api');
const authController = require('../controller/authController');
const { authenticate } = require('../middleware');

router.post(api.login, authController.login);
router.post(api.signup, authController.signup);
router.post(api.authenticate, authenticate, authController.authenticate);
router.get(api.logout, authenticate, authController.logout);

module.exports = router;
