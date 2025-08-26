import { NextFunction, Request, Response } from "express";
import { ProxyService } from '../services/ProxyService';
import { BadRequestError } from "../utils/errors/BadRequestError";
import { NotFoundError } from "../utils/errors/NotFoundError";

export class ProxyController {
    static async getM3u8Content(req: Request, res: Response, next: NextFunction) {
        const service = req.params.service as string;

        if (['rojadirecta'].includes(service)) {
            let d = req.query.d as string;
            let url = decodeURIComponent(Buffer.from(d, "base64").toString());
            let m3u8Content = await ProxyService.getM3u8ContentByUrl(url);
            res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
            res.send(m3u8Content);
        } else {
            throw new NotFoundError(`serviceCode ${service} not supported`);
        }
    };
}