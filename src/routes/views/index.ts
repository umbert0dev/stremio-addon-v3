import express from 'express';

import statsRouter from "@routes/views/stats";
import domainsRouter from "@routes/views/domains";
import loginRouter from "@routes/views/login";

const router = express.Router();

router.use('/domains', domainsRouter);
router.use('/stats', statsRouter);
router.use('/login', loginRouter);

export default router;