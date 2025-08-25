import express, { Request, Response } from "express";
import * as m3u8Controller from "@controllers/m3u8";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.query.s) throw new Error("missing s param");
    if (!req.query.referer) throw new Error("missing referer param");
    if (!req.query.origin) throw new Error("missing origin param");
    if (!req.query.domain) throw new Error("missing domain param");
    const s = req.query.s as string;
    const segmentPath = Buffer.from(s, "base64").toString();
    const referer = decodeURIComponent(req.query.referer as string);
    const origin = decodeURIComponent(req.query.origin as string);
    const domain = decodeURIComponent(req.query.domain as string);

    let content = await m3u8Controller.getM3u8Content(segmentPath, referer, origin, domain);

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(content);
  } catch (err) {
    res.status(500).send("Error fetching segment");
  }
});

export = router;