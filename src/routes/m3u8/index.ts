import express, { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";
import { query, validationResult } from "express-validator";
import { validateRequest } from "@mw/validateRequest";
import { M3u8Controller } from "@/src/controllers/M3u8Controller";

const router = express.Router();


router.get(
  "/",
  [
    query("s").exists().withMessage("missing s param").isString(),
    query("referer").exists().withMessage("missing referer param").isString(),
    query("origin").exists().withMessage("missing origin param").isString(),
    query("domain").exists().withMessage("missing domain param").isString(),
    validateRequest
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await M3u8Controller.getM3u8Content(req, res, next);

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(content);
    } catch (error) {
      next(error);
    }
  }
);

export = router;