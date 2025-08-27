import { NextFunction, Request, Response } from "express";
import StremioResponse from "@models/StremioResponse";
import { BadRequestError } from "@utils/errors/BadRequestError";
import { StreamService } from "@services/StreamService";
import { RequestContext } from "../models/RequestContext";

export class StreamController {
    static async getTvChannel(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, id } = req.params;
            if (!type) throw new BadRequestError("missing type path param");
            if (!id) throw new BadRequestError("missing id path param");

            const protocol = req.protocol;
            const host = req.get("host") || "";
            
            const externalId = id.split(":")[0];
            const providerCode = id.split("-")[1];

            if (!externalId) throw new BadRequestError("missing externalId");
            if (!providerCode) throw new BadRequestError("missing providerCode");

            const context: RequestContext = {
                streamType: type,
                providerCode: providerCode,
                protocol: req.protocol,
                host: req.get("host") || "",
            };

            let streamList = await StreamService.getMediaLinks(context, externalId);
            const stremioResponse = new StremioResponse(streamList);
            return res.json(stremioResponse.toJson());
        } catch (error) {
            next(error)
        }
    };
}