import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { getUserStorageStats } from '../controllers/stats.controller.js'
const router = express.Router()


router.get('/stats/storage', authMiddleware, getUserStorageStats)

export default router