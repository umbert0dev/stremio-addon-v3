import express from 'express';

import statsRouter from "@routes/views/stats";
import providersRouter from "@routes/views/providers";
import loginRouter from "@routes/views/login";

const router = express.Router();

router.use('/providers', providersRouter);
router.use('/stats', statsRouter);
router.use('/login', loginRouter);

export default router;