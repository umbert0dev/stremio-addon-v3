import axios, { AxiosInstance } from 'axios';
import * as cheerioLib from "cheerio";
import LogService from './LogService';
import { DomainService } from './DomainService';
import StreamObject from '@models/StreamObject';
import { Meta } from '@models/Meta';
import { M3U8Object } from '@models/M3U8Object';
import { Dialog, HTTPRequest, HTTPResponse, launch } from 'puppeteer';
import PuppeteerSingleton from '@/src/services/PuppeteerSingleton';

export abstract class AbstractStreamingService {
    externalId: string | null = null;
    seasonNumber: string | null = null;
    episodeNumber: string | null = null;
    cheerio = cheerioLib;
    logService = LogService;
    client: AxiosInstance;
    mediaType: string;
    serviceCode: string;
    protocol: string;
    host: string;
    baseURL!: string;

    constructor(serviceCode: string, mediaType: string, baseURL: string, protocol: string, host: string) {
        if (new.target === AbstractStreamingService) {
            throw new Error("AbstractStreamingService cannot be instantiated directly.");
        }
        if (!mediaType) throw new Error('Il tipo di media non può essere nullo');
        if (!serviceCode) throw new Error('serviceCode non può essere nullo');

        this.serviceCode = serviceCode;
        this.client = axios.create({});
        this.mediaType = mediaType;
        this.protocol = protocol;
        this.host = host;
        this.baseURL = baseURL;
    }

    abstract getMediaLinks(id: string): Promise<StreamObject[]>;
    abstract getChannelList(): Promise<any[]>;
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