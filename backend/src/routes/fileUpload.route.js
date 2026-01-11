import express from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { fileUpload } from '../controllers/uploadFiles.controller.js';
const router = express.Router();


const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/files/upload',authMiddleware, upload.single('file') , fileUpload)


export default router