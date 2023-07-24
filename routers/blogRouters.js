const router = require('express').Router()
const { blogControllers } = require('../controllers')
const { verifyToken } = require('../middleware/auth')
const { checkCreateBlog, checkBlogById, checkLikeBlog, checkMyBlog, checkLikedBlog, checkDeleteBlog } = require('../middleware/blogValidator')
const { multerUpload } = require('../middleware/multer')


router.get('/allBlog', blogControllers.allBlog)
router.get('/blogById',checkBlogById, blogControllers.blogById)
router.get('/listCategory', blogControllers.listCategory)
router.post('/createBlog',verifyToken,multerUpload('./public/blog', 'blog').single('file'), checkCreateBlog, blogControllers.createBlog)
router.post('/likeBlog',checkLikeBlog, verifyToken, blogControllers.likeBlog)
router.get('/myBlog',checkMyBlog,verifyToken, blogControllers.getUserBlog)
router.get('/userLikeBlog',checkLikedBlog,verifyToken, blogControllers.getLikeBlog)
router.delete('/deleteBlog',checkDeleteBlog,verifyToken, blogControllers.deleteBlog)



module.exports = router