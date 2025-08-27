import { RequestContext } from "../models/RequestContext";
import { StreamingStrategy } from "./StreamingStrategy";

export class StreamService {
    static async getMediaLinks(context: RequestContext, mediaLinkId: string) {
        const realService = await StreamingStrategy.create(context);
        return await realService.getMediaLinks(mediaLinkId);
    };
}