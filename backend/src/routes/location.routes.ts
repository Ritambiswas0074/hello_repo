import { Router } from 'express';
import { getAllLocations, getLocationById } from '../controllers/location.controller';

const router = Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);

export default router;

