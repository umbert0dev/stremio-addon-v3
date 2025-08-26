
import { Request, Response, NextFunction } from "express";
import { M3u8Service } from "@/src/services/M3u8Service";
import { Meta } from "@models/Meta";
import { StreamingStrategy } from "@services/StreamingStrategy";
import { BadRequestError } from "@utils/errors/BadRequestError";
import { MetaService } from "@services/MetaService";

export class MetaController {
  static async getTvChannelMeta(req: Request, res: Response, next: NextFunction) {
    try {
        const streamType = req.params.type as string;
        const id  = req.params.id as string;
        if(!streamType) throw new BadRequestError(`missing streamType path param`);
        if(!id) throw new BadRequestError(`missing id path param`);
        const host = req.get("host") || "";
        const protocol = req.protocol;
        if (streamType === "tv") {
            const externalId = id.split(":")[0];
            const providerKey = id.split("-")[1];
            if(!providerKey) throw new BadRequestError(`providerKey is not valid`);
            if(!externalId) throw new BadRequestError(`externalId is not valid`);
            const meta = await MetaService.getTvChannelMeta(providerKey, externalId, streamType, protocol, host);
            res.json({ meta });   
        }
        else {
            throw new BadRequestError(`stream type not supported`);
        }
    } catch (error) {
        next(error);
    }
  }
}
