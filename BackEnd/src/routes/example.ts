import { Router } from 'express';

const router = Router();

router.get('/hello', (_req, res) => res.json({ hello: 'world' }));

export default router;
