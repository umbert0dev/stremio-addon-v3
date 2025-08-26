import express from "express";
import { param } from "express-validator";
import { RequestValidator } from '@mw/RequestValidator';
import { StreamController } from "@/src/controllers/StreamController";

const router = express.Router();

router.get("/:type/:id.json", 
  [
    param("type").exists().withMessage("missing type path param").isString(),
    param("id").exists().withMessage("missing id path param").isString(),
    RequestValidator.validateRequest
  ],
  StreamController.getTvCahnnel
);

export = router;