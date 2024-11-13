import express from 'express'
import { deleteUser, followUser, getAllUsers, getUser, unfollowUser, updateUser,getFollowingUsers,getFollowersUsers } from '../controllers/UserController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/',getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)
router.put('/:id/unfollow',authMiddleWare, unfollowUser)
router.get('/:id/following',authMiddleWare, getFollowingUsers);  // Get followings
router.get('/:id/followers',authMiddleWare, getFollowersUsers);  // Get followers
export default router