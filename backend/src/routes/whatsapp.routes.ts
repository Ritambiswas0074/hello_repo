import { Router } from 'express';
import { getWhatsAppContact } from '../controllers/whatsapp.controller';

const router = Router();

router.get('/contact', getWhatsAppContact);

export default router;

