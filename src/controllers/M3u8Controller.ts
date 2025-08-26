import { Request, Response, NextFunction } from "express";
import { M3u8Service } from "@/src/services/M3u8Service";

export class M3u8Controller {
  static async getM3u8Content(req: Request, res: Response, next: NextFunction) {
    try {
      const s = req.query.s as string;
      const segmentPath = Buffer.from(s, "base64").toString();
      const referer = decodeURIComponent(req.query.referer as string);
      const origin = decodeURIComponent(req.query.origin as string);
      const domain = decodeURIComponent(req.query.domain as string);

      const content = await M3u8Service.getM3u8ContentByPath(segmentPath, referer, origin, domain);

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(content);
    } catch (error) {
      next(error);
    }
  }
}
