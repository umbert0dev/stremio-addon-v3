import express from 'express';
import apiProviderRouter from '@routes/api/privateApi/providers';
import apiStatsRouter from '@routes/api/privateApi/stats';
import * as authMw from '@mw/authMw';

const router = express.Router();

if (process.env.USE_CREDENTIALS === "true") {
    router.use(authMw.isAuthenticatedApi);
}

router.use('/providers', apiProviderRouter);
router.use('/stats', apiStatsRouter);

export default router;