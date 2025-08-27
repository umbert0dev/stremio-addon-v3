import {AbstractStreamingService } from '@services/AbstractStreamingService';
import StreamObject from '@models/StreamObject';
import { ChannelLink } from '@models/ChannelLink';
import { Meta } from '@models/Meta';
import { UtilityHelper } from '@utils/UtilityHelper';
import { Provider } from '@models/Provider';
import { CatalogChannel } from '@models/CatalogChannel';
import { RequestContext } from '../models/RequestContext';

export class RojadirectaService extends AbstractStreamingService {
    constructor(context: RequestContext, provider: Provider) {
        super('rojadirecta', context, provider);
    }

    async getMediaLinks(id: string): Promise<StreamObject[]> {
        let streamList: StreamObject[] = [];
        try {
            const mediaId = id.split("-")[2];
            if (mediaId) {
                const response = await this.client.get(this.provider.baseURL, { 
                    headers: {
                        "User-Agent": UtilityHelper.randomUserAgent()
                    }
                });
                const $ = this.cheerio.load(response.data);

                const elements = Array.from($('#agendadiv span.list > span'));
                const el = elements[parseInt(mediaId)];
                let channelLinkList: ChannelLink[] = Array.from($(el).find('span span.submenu table tbody tr'))
                    .map(row => {
                        const cells = Array.from($(row).find('td'));
                        const name = $(cells[1]).text().trim() || null;
                        const lang = $(cells[2]).text().trim() || null;
                        const link = $(cells[5]).find('a').first().attr('href') || null;
                        return { name, lang, link };
                    })
                    .filter(e => e.link && e.name && e.lang)
                    .sort((a, b) => {
                        if (a.lang === 'it' && b.lang !== 'it') return -1;
                        if (a.lang !== 'it' && b.lang === 'it') return 1;
                        return 0;
                    });
                return channelLinkList.map((channelLink: ChannelLink) => {
                    let proxyM3U8Url = `${this.protocol}://${this.host}/proxy/${this.serviceCode}?d=${Buffer.from(encodeURIComponent(channelLink.link!)).toString("base64")}`;
                    return new StreamObject(proxyM3U8Url)
                        .setStreamService(this.serviceCode)
                        .setTitle(`${channelLink.name} (${channelLink.lang})`);
                });
            }
        } catch (error) {
            this.logService.log(error, 'error');
        }
        return streamList;
    }

    async getChannelList(): Promise<CatalogChannel[]> {
        const response = await this.client.get(this.provider.baseURL, {
            headers: {
                "User-Agent": UtilityHelper.randomUserAgent()
            }
        });
        const $ = this.cheerio.load(response.data);

        const elements = Array.from($('#agendadiv span.list > span'));
        const channels = await Promise.all(elements.map(async (el, index) => {
            const time = $(el).find('span.t').first().text().replace(/\s+/g, ' ').trim();
            const title = $(el).find('span[itemprop="name"]').text().replace(/\s+/g, ' ').trim();
            return {
                id: `ihaveastream-${this.serviceCode}-${index}`,
                name: `(${time}) ${title}`,
                type: 'tv',
                genres: ['roja'],
                logo: this.provider.poster,
                posterShape: 'square'
            } as CatalogChannel;
        }));

        return channels;
    }

    async getTvChannelMeta(id: string): Promise<Meta> {
        const mediaId = id.split("-")[2];
        let meta = {
            id,
            name: `No name found`,
            type: 'tv',
            poster: null,
            genres: null
        };
        if (mediaId) {
            const response = await this.client.get(this.provider.baseURL, { 
                headers: {
                    "User-Agent": UtilityHelper.randomUserAgent()
                }
            });
            const $ = this.cheerio.load(response.data);

            const elements = Array.from($('#agendadiv span.list > span'));
            const el = elements[parseInt(mediaId)];
            const time = $(el).find('span.t').first().text().replace(/\s+/g, ' ').trim();
            const title = $(el).find('span[itemprop="name"]').text().replace(/\s+/g, ' ').trim();
            meta.name = `(${time}) ${title}`;
        }
        return meta;
    }
}