import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route';
import documentRoutes from '../modules/document/document.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);

export default router;
