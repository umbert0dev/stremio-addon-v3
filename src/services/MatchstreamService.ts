import {AbstractStreamingService } from '@services/AbstractStreamingService';
import StreamObject from '@models/StreamObject';
import { ChannelLink } from '@models/ChannelLink';
import { Meta } from '@models/Meta';
import { UtilityHelper } from '@utils/UtilityHelper';
import { Provider } from '@models/Provider';
import { CatalogChannel } from '@models/CatalogChannel';
import { RequestContext } from '../models/RequestContext';

export class MatchstreamService extends AbstractStreamingService {
    constructor(context: RequestContext, provider: Provider) {
        super('matchstream', context, provider);
    }

    async getMediaLinks(id: string): Promise<StreamObject[]> {
        let streamList: StreamObject[] = [];
        try {
            const mediaId = id.split("-")[2];
            if (mediaId) {
                const browser = await UtilityHelper.newBrowser();
                const page = await browser.newPage();

                await page.goto(`${this.provider.baseURL}/viewer`, {
                    waitUntil: "networkidle0",
                });

                await page.waitForSelector("#matchesBody tr");

                let elements = await page.$$eval("#matchesBody tr", trs =>
                    trs.map(tr => tr.outerHTML)
                );
                
                const el = elements[parseInt(mediaId)];
                const $ = this.cheerio.load(`<table>${el}</table>`);
                const cells = $("td");
                
                const linkCell = cells.eq(2);
                const linkTag = linkCell.find("a").first();
                const linkHref = linkTag.attr("href");

                await page.goto(`${this.provider.baseURL}/${linkHref}`, {
                    waitUntil: "networkidle0",
                });

                await page.waitForSelector("#links-container a");

                elements = await page.$$eval("#links-container a", trs =>
                    trs.map(tr => tr.outerHTML)
                );

                let channelLinkList: ChannelLink[] = elements.map(el => {
                    const $ = this.cheerio.load(`${el}`);
                    const aTag = $('a');
                    const link = aTag.attr('href') || '';

                    const fullText = aTag.text().trim();
                    const match = fullText.match(/^(.*?)(?: #\d+)? \[(.*)\]$/);

                    let name = fullText;
                    let lang = '';

                    if (match) {
                        name = match[1]?.trim() || name;
                        lang = match[2]?.trim().toLowerCase() || lang;
                    }

                    return { name, lang, link };
                })
                .filter(e => e.link && e.name && e.lang)
                .sort((a, b) => {
                    if (a.lang === 'it' && b.lang !== 'it') return -1;
                    if (a.lang !== 'it' && b.lang === 'it') return 1;
                    return 0;
                });

                await page.close();
                await browser.close();

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
        const browser = await UtilityHelper.newBrowser();
        const page = await browser.newPage();

        await page.goto(`${this.provider.baseURL}/viewer`, {
            waitUntil: "networkidle0",
        });

        await page.waitForSelector("#matchesBody tr");

        let elements = await page.$$eval("#matchesBody tr", trs =>
            trs.map(tr => tr.outerHTML)
        );

        return elements.map((el, index) => {
            const $ = this.cheerio.load(`<table>${el}</table>`);
            const cells = $("td");

            const titleCell = cells.eq(0);
            const titleSpan = titleCell.find("span");
            const title = titleSpan.first().text().trim();
            
            const timeCell = cells.eq(1);
            const time = timeCell.text().trim();

            return {
                id: `ihaveastream-${this.serviceCode}-${index}`,
                name: `(${time}) ${title}`,
                type: "tv",
                logo: this.provider.poster,
                posterShape: "square",
            } as CatalogChannel;
        });

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
            const browser = await UtilityHelper.newBrowser();
            const page = await browser.newPage();

            await page.goto(`${this.provider.baseURL}/viewer`, {
                waitUntil: "networkidle0",
            });

            await page.waitForSelector("#matchesBody tr");

            let elements = await page.$$eval("#matchesBody tr", trs =>
                trs.map(tr => tr.outerHTML)
            );

            const el = elements[parseInt(mediaId)];
            const $ = this.cheerio.load(`<table>${el}</table>`);
            const cells = $("td");

            const titleCell = cells.eq(0);
            const titleSpan = titleCell.find("span");
            const title = titleSpan.first().text().trim();
            
            const timeCell = cells.eq(1);
            const time = timeCell.text().trim();

            meta.name = `(${time}) ${title}`;
        }
        return meta;
    }
}