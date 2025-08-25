import express, { NextFunction, Request, Response } from "express";
import * as m3u8Controller from "@controllers/m3u8";
import { error } from "console";
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

    let content = await m3u8Controller.getM3u8Content(segmentPath, referer, origin, domain);

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(content);
  } catch (error) {
    next(error)
  }
});

export = router;