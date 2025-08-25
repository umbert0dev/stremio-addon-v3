import { UtilityHelper } from '@utils/UtilityHelper';
import axios from "axios";


export const getM3u8Content = async (path: string, referer: string, origin: string, domain: string): Promise<string> => {
    const m3u8Url = new URL(path, domain).toString();

    const response = await axios.get(m3u8Url, {
      headers: {
        Referer: referer,
        Origin: origin,
        "User-Agent": UtilityHelper.randomUserAgent()
      }
    });

    let m3u8Content = response.data as string;

    return m3u8Content.replace(/^(?!#)(.*\.ts.*)$/gm, (line) => {
      const encoded = Buffer.from(line.trim()).toString("base64");
      return `/segment?s=${encoded}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`;
    });
};