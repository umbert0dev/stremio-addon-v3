import { M3U8Object } from "../models/M3U8Object";
import { Browser, LaunchOptions, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY, BrowserContext, Dialog, HTTPRequest } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import LogService from "@services/LogService";
puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
)

export class UtilityHelper {
    private static userAgents: string[] = [
        // Desktop
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        // Mobile
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.185 Mobile Safari/537.36"
    ];

    public static randomUserAgent(): string {
        const index = Math.floor(Math.random() * this.userAgents.length);
        return this.userAgents[index]!;
    }
    
    static stringToBool(str: string | undefined | null): boolean {
        return str?.toLowerCase() === "true";
    }

    static async newBrowser() {
        const unsafelyOrigins = ['http://www.rojadirecta.eu'];
        let args =[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-gpu',
            '--no-zygote',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--enable-popup-blocking',
            '--ignore-certificate-errors',
            '--disable-features=site-per-process',
            '--disable-features=UpgradeInsecureRequests',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
            '--allow-running-insecure-content',
            `--unsafely-treat-insecure-origin-as-secure=${unsafelyOrigins.join(",")}`
        ];
        const puppeteerConfig: LaunchOptions = {
            headless: true,
            args
        };

        if (process.env.PUPPETEER_PATH) {
            puppeteerConfig.executablePath = process.env.PUPPETEER_PATH;
        }

        return await puppeteer.launch(puppeteerConfig);
    }

    static async sniffM3u8(url: string): Promise<M3U8Object|null> {
        let m3u8Obj: M3U8Object|null = null;
        const browser = await this.newBrowser();

        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            url,
            'Sec-GPC': '1',
            'DNT': '1',
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
        });
    
        await page.setRequestInterception(true);
    
        await page.evaluateOnNewDocument(() => {
            window.open = () => null;
        });
    
        page.on("dialog", async (dialog: Dialog) => {
          await dialog.accept();
        });
    
        page.on('response', async (response) => {
            try {
                const url = response.url();
                if (url.includes('analytics') || url.includes('ads') || url.includes('social') ||
                    url.includes('disable-devtool') || url.includes('cloudflareinsights') || url.includes('ainouzaudre') ||
                    url.includes('pixel.embed') || url.includes('histats')) {
                    return;
                }

                if (url.includes('.m3u8')) {
                    const status = response.status();
                    if (status === 200) {
                        const headers = response.request().headers();
                        m3u8Obj = {
                            content: null,
                            url,
                            referer: headers['referer'] || '',
                            origin: headers['origin'] || ''
                        };
                    }
                }

            } catch (err) {
                console.error('Errore nella response handler', err);
            }
        });
    
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
            const foundUrls = new Promise(resolve => {
                const interval = setInterval(() => {
                    if (m3u8Obj && m3u8Obj.url) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 500);
            });
              const timeout = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout: No stream URL detected within 10 seconds')), 10000)
              );
            await Promise.race([foundUrls, timeout]);
            await page.close();
            if (!m3u8Obj) {
                throw new Error('No stream URL found');
            }
            await browser.close();
            return m3u8Obj;
        } catch (err) {
            LogService.log(err, 'error');
            await browser.close();
            return m3u8Obj;
        }
    }

    static rewriteTsOrM3u8(m3u8Content: string, referer: string, origin: string, domain: string): string 
    {
        return m3u8Content.replace(/^(?!#)(.*\.ts.*)$/gm, (line) => {
            let encoded = Buffer.from(line.trim()).toString("base64");
            return `/segment?s=${encoded}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}&domain=${encodeURIComponent(domain)}`;
        }).replace(/^(?!#)(.*\.m3u8.*)$/gm, (line) => {
            let encoded = Buffer.from(line.trim()).toString("base64");
            return `/m3u8?s=${encoded}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}&domain=${encodeURIComponent(domain)}`;
        });
    }
}