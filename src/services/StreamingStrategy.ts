import { BadRequestError } from "@utils/errors/BadRequestError";
import { AbstractStreamingService } from "./AbstractStreamingService";
import { ProviderManager } from "./ProviderManager";
import { RojadirectaService } from "./RojadirectaService";
import { RequestContext } from "../models/RequestContext";
import { MatchstreamService } from "./MatchstreamService";

const providers: Record<string, any> = {
    'rojadirecta': RojadirectaService,
    'matchstream': MatchstreamService,
};

export class StreamingStrategy {
    static async create(context: RequestContext): Promise<AbstractStreamingService> {
        const ServiceClass = providers[context.providerCode];
        if (!ServiceClass) {
            throw new BadRequestError(`Provider ${context.providerCode} not implemented`);
        }
        const provider = await ProviderManager.getProvider(context.providerCode);
        if (!provider) {
            throw new Error(`provider with code: ${context.providerCode} not found`);
        }
        return new ServiceClass(context, provider);
    }
}