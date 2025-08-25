import { Browser, LaunchOptions, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY, BrowserContext } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
)


class PuppeteerSingleton {
    private unsafelyOrigins = ['http://www.rojadirecta.eu'];
    private static instance: PuppeteerSingleton;
    private browser: Browser | null = null;
    private browserContext: BrowserContext | null = null;

    private constructor() {}

    static getInstance(): PuppeteerSingleton {
        if (!PuppeteerSingleton.instance) {
            PuppeteerSingleton.instance = new PuppeteerSingleton();
        }
        return PuppeteerSingleton.instance;
    }

    async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await this.launchBrowser();
        }
        return this.browser;
    }

    async launchBrowser(): Promise<Browser> {
        let args =[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-gpu',
            '--no-zygote',
            '--ignore-certificate-errors',
            '--disable-features=site-per-process',
            '--disable-features=UpgradeInsecureRequests',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
            '--allow-running-insecure-content',
            `--unsafely-treat-insecure-origin-as-secure=${this.unsafelyOrigins.join(",")}`
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


    async getContext(): Promise<BrowserContext> {
        if (!this.browserContext) {
            const browser = await this.getBrowser();
            this.browserContext = await browser.defaultBrowserContext();
            await this.browserContext.newPage();

        }

        return this.browserContext;
    }
}

export default PuppeteerSingleton;