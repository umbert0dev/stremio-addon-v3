import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/errors/BadRequestError";
import { SegmentService } from "../services/SegmentService";

export class SegmentController {
    static async getM3u8Content(req: Request, res: Response, next: NextFunction) {
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

            let response = await SegmentService.getStreamSegment(segmentPath, referer, origin, domain);

            res.setHeader("Content-Type", response.headers["content-type"]);
            response.data.pipe(res);
        } catch (error) {
            next(error)
        }
    };
}