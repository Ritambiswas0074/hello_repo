import { Router } from 'express';
import { getAllTemplates, getTemplateById } from '../controllers/template.controller';

const router = Router();

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);

export default router;

