const express=require('express')

const router=express.Router()
const {login,register,follow,unfollow,getuser,createpost,likepost,deletepost,comment,getpost, getallposts,unlikepost}=require('../controllers/main')
const authMiddleware=require('../middleware/auth')



router.route('/authenticate').post(register)
router.route('/login').post(login)

router.route('/follow/:id').post(authMiddleware,follow)
router.route('/unfollow/:id').post(authMiddleware,unfollow)
router.route('/user').get(authMiddleware,getuser)
router.route('/posts').post(authMiddleware,createpost)
router.route('/posts/:id').delete(authMiddleware,deletepost)
router.route('/like/:id').post(authMiddleware,likepost)
router.route('/unlike/:id').post(authMiddleware,unlikepost)
router.route('/comment/:id').post(authMiddleware,comment)
router.route('/posts/:id').get(authMiddleware,getpost)
router.route('/all_posts').get(authMiddleware,getallposts)



module.exports=router 