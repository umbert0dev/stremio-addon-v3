import { NextFunction, Request, Response } from "express";
import { StreamingStrategy } from "@services/StreamingStrategy";
import StremioResponse from "../models/StremioResponse";
import StreamObject from "../models/StreamObject";

export class StreamController {
    static async getTvCahnnel(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, id } = req.params;
            let streamList: StreamObject[] = [];
            if (type && id) {
                const protocol = req.protocol;
                const host = req.get("host") || "";
                
                const externalId = id.split(":")[0];
                const providerKey = id.split("-")[1];
                if (providerKey && externalId) {
                    const realService = await StreamingStrategy.create(providerKey, type, protocol, host);
                    streamList = await realService.getMediaLinks(externalId);
                }
            }
            const stremioResponse = new StremioResponse(streamList);
            return res.json(stremioResponse.toJson());
        } catch (error) {
            next(error)
        }
    };
}