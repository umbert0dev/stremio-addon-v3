import { Request, Response } from "express";
import { Meta } from "@models/Meta";
import { StreamingStrategy } from "@services/StreamingStrategy";

export const getTvChannelMeta = async (req: Request, res: Response): Promise<Meta> => {
    const { type, id } = req.params;
    const host = req.get("host") || "";
    const protocol = req.protocol;

    let meta: Meta = {
        id: "",
        name: "",
        description: "",
        type: "",
        poster: null,
        genres: null
    };

    if (type === "tv" && id) {
        const externalId = id.split(":")[0];
        const providerKey = id.split("-")[1];

        if (providerKey && externalId) {
            meta.id = externalId;
            const realService = await StreamingStrategy.create(providerKey, type, protocol, host);
            if (realService) {
                meta = await realService.getTvChannelMeta(externalId);
            }
        }
    }

    return meta;
};
