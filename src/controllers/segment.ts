import { Request, Response } from "express";
import { UtilityHelper } from '@utils/UtilityHelper';
import axios, { AxiosResponse } from "axios";


export const getStreamSegment = async (segmentPath: string, referer: string, origin: string, domain: string): Promise<AxiosResponse> => {
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