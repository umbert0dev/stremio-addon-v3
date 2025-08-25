import { Request, Response } from "express";
import { StreamingStrategy } from "@services/StreamingStrategy";
import { UtilityHelper } from '@utils/UtilityHelper';
import axios from "axios";
import { AppError } from "@utils/errors/AppError";
import { NotFoundError } from "@utils/errors/NotFoundError";
import { BadRequestError } from "@utils/errors/BadRequestError";


export const getM3u8Content = async (req: Request, res: Response): Promise<string> => {
    const protocol = req.protocol;
    const host = req.get("host") || "";
    if (!req.query.d) throw new Error('Missing m3u8 URL');
    let d = req.query.d as string;
    let service = req.params.service as string;
    let url = decodeURIComponent(Buffer.from(d, "base64").toString());
    const realService = await StreamingStrategy.create(service, 'tv', protocol, host);
    let m3u8Object = await UtilityHelper.sniffM3u8(url);
    if (!m3u8Object) {
        throw new NotFoundError("m3u8Object not found");
    }
    const m3u8Url = new URL(m3u8Object.url);
    const pathParts = m3u8Url.pathname.split('/'); 
    pathParts.pop(); // remove .m3u8 file
    const basePath = pathParts.join('/');
    const referer = m3u8Object.referer || m3u8Object.origin || '';
    const origin = m3u8Object.origin || m3u8Object.referer || '';

    const domain = `${m3u8Url.protocol}//${m3u8Url.host}${basePath}`;
    let m3u8ContentResponse = await axios.get(m3u8Object.url, {
        headers: {
            "Referer": referer,
            "Origin": origin,
            "User-Agent": UtilityHelper.randomUserAgent(),
        },
    });
    if (!m3u8ContentResponse || m3u8ContentResponse.data.includes('#EXT-X-KEY')) {
        throw new AppError("content is protected by key");
    }
    return UtilityHelper.rewriteTsOrM3u8(m3u8ContentResponse.data, referer, origin, domain);
};