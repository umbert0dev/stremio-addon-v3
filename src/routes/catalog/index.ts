import express, { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";
import { CatalogController } from "@/src/controllers/CatalogController";
import { param, query } from "express-validator";
import { RequestValidator } from '@mw/RequestValidator';

const router = express.Router();

router.get("/:type/:catalogId.json", 
  [
    param("type").exists().withMessage("missing type path param").isString(),
    param("catalogId").exists().withMessage("missing catalogId path param").isString(),
    RequestValidator.validateRequest
  ],
  CatalogController.getChannelList
);

export = router;