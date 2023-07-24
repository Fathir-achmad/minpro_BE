const router = require('express').Router()
const { blogControllers } = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const { checkCreateBlog } = require('../middleware/blogValidator')
const { multerUpload } = require('../middleware/multer')


router.get('/allBlog', blogControllers.allBlog)
router.get('/listCategory', blogControllers.listCategory)
router.post('/createBlog',verifyToken,multerUpload('./public/blog', 'blog').single('file'), checkCreateBlog, blogControllers.createBlog)
router.post('/likeBlog', verifyToken, blogControllers.likeBlog)
router.get('/myBlog',verifyToken, blogControllers.getUserBlog)
router.get('/userLikeBlog',verifyToken, blogControllers.getLikeBlog)
router.delete('/deleteBlog',verifyToken, blogControllers.deleteBlog)



module.exports = router