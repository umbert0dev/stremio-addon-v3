import express, { NextFunction, Request, Response } from "express";
import * as segmentController from "@controllers/segment";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";
const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.query.s) throw new BadRequestError("missing s param");
    if (!req.query.referer) throw new BadRequestError("missing referer param");
    if (!req.query.origin) throw new BadRequestError("missing origin param");
    if (!req.query.domain) throw new BadRequestError("missing domain param");
    const s = req.query.s as string;
    const segmentPath = Buffer.from(s, "base64").toString();
    const referer = decodeURIComponent(req.query.referer as string);
    const origin = decodeURIComponent(req.query.origin as string);
    const domain = decodeURIComponent(req.query.domain as string);

    let response = await segmentController.getStreamSegment(segmentPath, referer, origin, domain);

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    next(error)
  }
});


export = router;