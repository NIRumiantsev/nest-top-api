import { Controller, Get, Header } from "@nestjs/common";
import { TopPageService } from "../top-page/top-page.service";
import { ConfigService } from "@nestjs/config";
import { formatISO, subDays } from "date-fns";
import { Builder } from "xml2js";
import { CATEGORY_URL } from "./sitemap.constants";

@Controller('sitemap')
export class SitemapController {
  domain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly topPageService: TopPageService
  ) {
    this.domain = this.configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('content-type', 'text/xml')
  async siteMap() {
    let response = [{
      loc: this.domain,
      lastmod: formatISO(subDays(new Date(), 1)),
      changefreq: 'daily',
      priority: '1.0'
    }];
    Object.values(CATEGORY_URL).forEach((url) => {
      response.push({
        loc: `${this.domain}/${url}`,
        lastmod: formatISO(subDays(new Date(), 1)),
        changefreq: 'daily',
        priority: '1.0'
      })
    });
    const pages = await this.topPageService.findAll();
    pages.forEach((page) => {
      response.push({
        loc: `${this.domain}/${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
        lastmod: formatISO(new Date(page.updatedAt)),
        changefreq: 'weekly',
        priority: '0.7'
      })
    });
    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8'}
    });
    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas'
        },
        url: response
      }
    });
  }
}

