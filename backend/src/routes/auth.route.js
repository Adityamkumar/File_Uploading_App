import express from 'express'
import { getCurrentUser, userLogin, userRegister } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
const router = express.Router()


router.post('/user/register', userRegister)
router.post('/user/login', userLogin)
router.get('/user/me', authMiddleware, getCurrentUser)

export default router