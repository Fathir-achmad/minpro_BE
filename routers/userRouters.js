const router = require('express').Router();
const { userControllers } = require('../controllers');
const { verifyToken } = require('../middleware/auth');
const { multerUpload } = require('../middleware/multer')
const { checkChangeUsername, checkChangePhone, checkChangeEmail, checkChangePassword } = require('../middleware/changeValidator')

router.patch('/changeUsername',checkChangeUsername, verifyToken, userControllers.changeUsername);
router.patch('/changePhone',checkChangePhone, verifyToken, userControllers.changePhone);
router.patch('/changeEmail',checkChangeEmail, verifyToken,userControllers.changeEmail);
router.patch('/changePassword',checkChangePassword,verifyToken, userControllers.changePassword);
router.post('/changeAvatar', verifyToken, multerUpload('./public/avatar', 'Avatar').single('file') , userControllers.changeAvatar);



module.exports = router;
