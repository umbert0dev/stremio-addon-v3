import { Request, Response, NextFunction } from "express";
import { CatalogService } from "../services/CatalogService";

export class CatalogController {
  static async getChannelList(req: Request, res: Response, next: NextFunction) {
    try {
        const type = req.params.type as string;
        const catalogId = req.params.catalogId as string;
        const providerCode = catalogId.split("_")[1] as string;
        const host = req.get("host") || "";
        const protocol = req.protocol;
        let channels = await CatalogService.getChannelList(providerCode, type, protocol, host);
        res.json({ metas: channels });
    } catch (error) {
      next(error);
    }
  }
}
