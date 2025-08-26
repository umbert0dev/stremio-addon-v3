import { Request, Response, NextFunction } from "express";
import { CatalogService } from "@services/CatalogService";
import { BadRequestError } from "@utils/errors/BadRequestError";

export class CatalogController {
  static async getChannelList(req: Request, res: Response, next: NextFunction) {
    try {
        const type = req.params.type as string;
        const catalogId = req.params.catalogId as string;
        if(!type) throw new BadRequestError(`missing type path param`);
        if(!catalogId) throw new BadRequestError(`missing catalogId path param`);
        const providerCode = catalogId.split("_")[1] as string;
        if(!providerCode) throw new BadRequestError(`missing providerCode`);
        const host = req.get("host") || "";
        const protocol = req.protocol;
        let channels = await CatalogService.getChannelList(type, providerCode, protocol, host);
        res.json({ metas: channels });
    } catch (error) {
        next(error);
    }
  }
}
