import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { shareFileLink } from '../controllers/share.controller.js'
import { openSharedFile } from '../controllers/publicShare.controller.js'
const router = express.Router()



//privat route
router.post('/files/:id/share', authMiddleware, shareFileLink)
router.get('/share/:token', openSharedFile)



export default router