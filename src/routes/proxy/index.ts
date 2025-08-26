import express, { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";
import { NotFoundError } from "@/src/utils/errors/NotFoundError";
import { ProxyController } from "@/src/controllers/ProxyController";
import { param, query } from "express-validator";
import { RequestValidator } from '@mw/RequestValidator';

const router = express.Router();

router.head('/:service', (req, res) => {
    res.status(200).send();
});

router.get('/:service', 
  [
    param("service").exists().withMessage("missing seriviceCode path param").isString(),
    query("d").exists().withMessage("missing d param").isString(),
    RequestValidator.validateRequest
  ],
  ProxyController.getM3u8Content
);

export = router;