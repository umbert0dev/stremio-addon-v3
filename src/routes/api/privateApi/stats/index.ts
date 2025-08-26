import express from 'express';
import { ApiController } from '@/src/controllers/ApiController';

const router = express.Router();

router.get("/", 
  ApiController.getStats
);

export default router;