import express, { NextFunction, Request, Response } from "express";
import * as proxyController from "@controllers/proxy";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";
import { NotFoundError } from "@/src/utils/errors/NotFoundError";

const router = express.Router();

router.head('/:service', (req, res) => {
    res.status(200).send();
});

router.get('/:service', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = req.params.service;
    if (!service) {
      throw new BadRequestError(`missing serviceCode`);
    }
    if (['rojadirecta'].includes(service)) {
      let m3u8Content = await proxyController.getM3u8Content(req, res);
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(m3u8Content);
    } else {
      throw new NotFoundError(`serviceCode ${service} not supported`);
    }
  } catch (error) {
    next(error);
  }
});

export = router;