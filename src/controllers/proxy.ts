import { Request, Response } from "express";
import { StreamingStrategy } from "@services/StreamingStrategy";
import { UtilityHelper } from '@utils/UtilityHelper';
import axios from "axios";
import LogService from "../services/LogService";


export const getM3u8Content = async (req: Request, res: Response): Promise<string> => {
    let content = "";
    try {
        const protocol = req.protocol;
        const host = req.get("host") || "";
        if (!req.query.d) throw new Error('Missing m3u8 URL');
        let d = req.query.d as string;
        let service = req.params.service as string;
        let url = decodeURIComponent(Buffer.from(d, "base64").toString());
        const realService = await StreamingStrategy.create(service, 'tv', protocol, host);
        if (realService) {
            let m3u8Object = await UtilityHelper.sniffM3u8(url);
            if (m3u8Object && m3u8Object.url && (m3u8Object.referer || m3u8Object.origin)) {
                const m3u8Url = new URL(m3u8Object.url);
                const pathParts = m3u8Url.pathname.split('/'); 
                pathParts.pop(); // rimuove il file m3u8
                const basePath = pathParts.join('/'); // rimane /hls

                const domain = `${m3u8Url.protocol}//${m3u8Url.host}${basePath}`;
                let m3u8ContentResponse = await axios.get(m3u8Object.url, {
                    headers: {
                        "Referer": m3u8Object.referer || m3u8Object.origin || '',
                        "Origin": m3u8Object.origin || m3u8Object.referer || '',
                        "User-Agent": UtilityHelper.randomUserAgent(),
                    },
                });
                if (m3u8ContentResponse && !m3u8ContentResponse.data.includes('#EXT-X-KEY')) {
                    if (m3u8ContentResponse.data) {
                        content = UtilityHelper.rewriteTsOrM3u8(m3u8ContentResponse.data, 
                            m3u8Object.referer || m3u8Object.origin || "", 
                            m3u8Object.origin || m3u8Object.referer || "", 
                            domain);
                    }
                }
                else {
                    LogService.log("content with key", "error");
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
    return content;
};