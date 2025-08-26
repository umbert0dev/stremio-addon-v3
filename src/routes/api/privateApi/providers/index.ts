import express from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '@/src/middlewares/validateRequest';
import { ApiController } from '@/src/controllers/ApiController';

const router = express.Router();

router.get('/',
    ApiController.getProviders
);

router.put('/:code', 
    [
        param("code").exists().withMessage("missing code path param").isString(),
        body("baseURL").exists().withMessage("missing baseURL body param").isString(),
        body("active").exists().withMessage("missing active body param").isString(),
        validateRequest
    ],
    ApiController.updateProvider
);

export default router;