const router = require('express').Router();
const { authControllers } = require('../controllers');
const { verifyToken } = require('../middleware/auth')
const { checkRegister, checkLogin, checkForgotPass, checkResetPass, checkVerify, checkKeepLogin } = require('../middleware/authValidator')

router.post('/register',checkRegister, authControllers.register);
router.patch('/verify',checkVerify,verifyToken, authControllers.verify);
router.post('/login',checkLogin, authControllers.login);
router.get('/keepLogin',checkKeepLogin,verifyToken, authControllers.keepLogin);
router.post('/forgotPassword',checkForgotPass, authControllers.forgotPassword);
router.patch('/resetPassword',checkResetPass,verifyToken, authControllers.resetPassword);

module.exports = router