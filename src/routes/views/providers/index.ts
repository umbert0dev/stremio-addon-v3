import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { AuthMw } from '@mw/AuthMw';
import { BASE_DIR } from '@config/paths';

const router = express.Router();

if (process.env.USE_CREDENTIALS === "true") {
    router.use(AuthMw.isAuthenticatedWeb);
}

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.join(BASE_DIR, 'src/public/html/providers.html'));
});

export default router;