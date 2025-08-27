import axios, { AxiosInstance } from 'axios';
import * as cheerioLib from "cheerio";
import LogService from './LogService';
import StreamObject from '@models/StreamObject';
import { Meta } from '@models/Meta';
import { Provider } from '@models/Provider';
import { CatalogChannel } from '@models/CatalogChannel';
import { RequestContext } from '../models/RequestContext';

export abstract class AbstractStreamingService {
    externalId: string | null = null;
    seasonNumber: string | null = null;
    episodeNumber: string | null = null;
    cheerio = cheerioLib;
    logService = LogService;
    client: AxiosInstance;
    streamType: string;
    serviceCode: string;
    protocol: string;
    host: string;
    provider!: Provider;

    constructor(serviceCode: string, context: RequestContext, provider: Provider) {
        if (new.target === AbstractStreamingService) {
            throw new Error("AbstractStreamingService cannot be instantiated directly.");
        }
        if (!context.streamType) throw new Error('streamType cannot be null');
        if (!context.providerCode) throw new Error('serviceCode cannot be null');

        this.serviceCode = context.providerCode;
        this.client = axios.create({});
        this.streamType = context.streamType;
        this.protocol = context.protocol;
        this.host = context.host;
        this.provider = provider;
    }

    abstract getMediaLinks(id: string): Promise<StreamObject[]>;
    abstract getChannelList(): Promise<CatalogChannel[]>;
    abstract getTvChannelMeta(id: string): Promise<Meta>;

    setExternalId(externalId: string) {
        this.externalId = externalId;
        return this;
    }

    setSeasonNumber(seasonNumber: string) {
        this.seasonNumber = seasonNumber;
        return this;
    }

    setEpisodeNumber(episodeNumber: string) {
        this.episodeNumber = episodeNumber;
        return this;
    }
}