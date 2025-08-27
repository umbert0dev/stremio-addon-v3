import { NextFunction, Request, Response } from "express";
import { ProxyService } from '@services/ProxyService';
import { NotFoundError } from "@utils/errors/NotFoundError";
import { BadRequestError } from "@utils/errors/BadRequestError";
import { ProviderManager } from "../services/ProviderManager";

export class ProxyController {
    static async getM3u8Content(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.params.service as string;
            if(!service) throw new BadRequestError(`missing service path param`);
            if(!req.query.d) throw new BadRequestError(`missing d query param`);
            let providersCodeList = ProviderManager.getAllProviders().map(p => p.code);
            
            if (providersCodeList.includes(service)) {
                let d = req.query.d as string;
                let url = decodeURIComponent(Buffer.from(d, "base64").toString());
                if(!url) throw new BadRequestError(`missing url`);
                
                let m3u8Content = await ProxyService.getM3u8ContentByUrl(url);
                res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
                res.send(m3u8Content);
            } else {
                throw new NotFoundError(`serviceCode ${service} not supported`);
            }
        } catch (error) {
            next(error);
        }
    };
}