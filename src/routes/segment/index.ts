import express, { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { validateRequest } from "@/src/middlewares/validateRequest";
import { SegmentController } from "@/src/controllers/SegmentController";
const router = express.Router();

router.get("/",
  [
    query("s").exists().withMessage("missing s query param").isString(),
    query("referer").exists().withMessage("missing referer query param").isString(),
    query("origin").exists().withMessage("missing origin query param").isString(),
    query("domain").exists().withMessage("missing domain query param").isString(),
    validateRequest
  ],
  SegmentController.getM3u8Content
);


export = router;