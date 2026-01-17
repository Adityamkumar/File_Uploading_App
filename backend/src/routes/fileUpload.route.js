import express from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { deleteFiles, fileUpload, getFiles} from '../controllers/uploadFiles.controller.js';
import { fileFilter } from '../middlewares/fileValidation.middleware.js';
import path from "path";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});



router.post('/files/upload', upload.single('file'),authMiddleware, fileUpload)
router.get('/files', authMiddleware, getFiles)
router.delete('/files/:id', authMiddleware, deleteFiles)


export default router