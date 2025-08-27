import { Request, Response, NextFunction } from "express";
import { CatalogService } from "@services/CatalogService";
import { BadRequestError } from "@utils/errors/BadRequestError";
import { RequestContext } from "@models/RequestContext";

export class CatalogController {
  static async getChannelList(req: Request, res: Response, next: NextFunction) {
    try {
        const type = req.params.type as string;
        const catalogId = req.params.catalogId as string;
        if(!type) throw new BadRequestError(`missing type path param`);
        if(!catalogId) throw new BadRequestError(`missing catalogId path param`);
        const providerCode = catalogId.split("_")[1] as string;
        if(!providerCode) throw new BadRequestError(`missing providerCode`);
        const context: RequestContext = {
          streamType: type,
          providerCode: providerCode,
          protocol: req.protocol,
          host: req.get("host") || "",
        };
        let channels = await CatalogService.getChannelList(context);
        res.json({ metas: channels });
    } catch (error) {
        next(error);
    }
  }
}
