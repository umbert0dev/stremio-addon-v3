import { Request, Response } from "express";
import { Meta } from "@models/Meta";
import { StreamingStrategy } from "@services/StreamingStrategy";
import { BadRequestError } from "../utils/errors/BadRequestError";

export const getTvChannelMeta = async (streamType: string, id: string, host: string, protocol: string): Promise<Meta> => {
    if (streamType != "tv") {
        throw new BadRequestError(`stream type not supported`);
    }
    const externalId = id.split(":")[0];
    const providerKey = id.split("-")[1];

    if(!providerKey || !externalId){
        throw new BadRequestError(`id is not valid`);
    }

    const realService = await StreamingStrategy.create(providerKey, streamType, protocol, host);
    return await realService.getTvChannelMeta(externalId);
};
