import express, { NextFunction, Request, Response } from "express";
import * as CatalogController from "@controllers/catalog";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";

const router = express.Router();

router.get("/:type/:catalogId.json", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, catalogId } = req.params;
    if (!type) throw new BadRequestError("missing type param");
    if (!catalogId) throw new BadRequestError("missing catalogId param");
    
    const providerCode = catalogId.split("_")[1] as string;
    const host = req.get("host") || "";
    const protocol = req.protocol;
    const channels = await CatalogController.getChannelList(type, providerCode, host, protocol);
    res.json({ metas: channels });
  } catch (error) {
    next(error)
  }
});

export = router;