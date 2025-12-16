import { Router } from 'express';
import { uploadMedia, getUserMedia, deleteMedia, upload } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadMedia);
router.get('/user', authenticate, getUserMedia);
router.delete('/:id', authenticate, deleteMedia);

export default router;

