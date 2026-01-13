import express from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { deleteFiles, fileUpload, getFiles } from '../controllers/uploadFiles.controller.js';
import { fileFilter } from '../middlewares/fileValidation.middleware.js';
const router = express.Router();


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter
})

router.post('/files/upload',authMiddleware, upload.single('file') , fileUpload)
router.get('/files', authMiddleware, getFiles)
router.delete('/files/:id', authMiddleware, deleteFiles)


export default router