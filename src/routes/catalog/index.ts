import express, { NextFunction, Request, Response } from "express";
import * as CatalogController from "@controllers/catalog";

const router = express.Router();

router.get("/:type/ihavestream_channels.json", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channels = await CatalogController.getChannelList(req, res);
    res.json({ metas: channels });
  } catch (error) {
    next(error)
  }
});

export = router;