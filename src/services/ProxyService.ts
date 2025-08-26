import axios from "axios";
import { UtilityHelper } from "@utils/UtilityHelper";
import { NotFoundError } from "@utils/errors/NotFoundError";
import { InternalServerError } from "@utils/errors/InternalServerError";

export class ProxyService {
  static async getM3u8ContentByUrl(url: string): Promise<string> {
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
        throw new InternalServerError("content is protected by key");
    }
    return UtilityHelper.rewriteTsOrM3u8(m3u8ContentResponse.data, referer, origin, domain);
  }
}