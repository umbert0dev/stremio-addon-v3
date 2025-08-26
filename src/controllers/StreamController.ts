import { NextFunction, Request, Response } from "express";
import StremioResponse from "@models/StremioResponse";
import { BadRequestError } from "@utils/errors/BadRequestError";
import { StreamService } from "@services/StreamService";

export class StreamController {
    static async getTvCahnnel(req: Request, res: Response, next: NextFunction) {
        try {
            const { type, id } = req.params;
            if (!type) throw new BadRequestError("missing type path param");
            if (!id) throw new BadRequestError("missing id path param");

            const protocol = req.protocol;
            const host = req.get("host") || "";
            
            const externalId = id.split(":")[0];
            const providerKey = id.split("-")[1];

            if (!externalId) throw new BadRequestError("missing externalId");
            if (!providerKey) throw new BadRequestError("missing providerKey");

            let streamList = await StreamService.getMediaLinks(providerKey, externalId, type, protocol, host);
            const stremioResponse = new StremioResponse(streamList);
            return res.json(stremioResponse.toJson());
        } catch (error) {
            next(error)
        }
    };
}