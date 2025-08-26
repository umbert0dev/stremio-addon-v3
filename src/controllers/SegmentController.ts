import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@utils/errors/BadRequestError";
import { SegmentService } from "@services/SegmentService";

export class SegmentController {
    static async getM3u8Content(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.s) throw new BadRequestError("missing s query param");
            if (!req.query.referer) throw new BadRequestError("missing referer query param");
            if (!req.query.origin) throw new BadRequestError("missing origin query param");
            if (!req.query.domain) throw new BadRequestError("missing domain query param");
            const s = req.query.s as string;
            const segmentPath = Buffer.from(s, "base64").toString();
            if(!segmentPath) throw new BadRequestError(`missing segmentPath`);

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