import axios from "axios";
import { UtilityHelper } from "../utils/UtilityHelper";

export class SegmentService {
    static async getStreamSegment(segmentPath: string, referer: string, origin: string, domain: string) {
        const segmentUrl = segmentPath.startsWith("http") ? segmentPath : `${domain}/${segmentPath}`;

        return await axios.get(segmentUrl, {
            headers: {
                "Referer": referer,
                "Origin": origin,
                "User-Agent": UtilityHelper.randomUserAgent(),
            },
            responseType: "stream",
        });
    };
}