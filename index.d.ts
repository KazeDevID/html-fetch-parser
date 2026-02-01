declare module 'html-fetch-parser' {
  export interface FetcherOptions {
    headers?: Record<string, string>;
    timeout?: number;
  }

  export interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
  }

  export interface ExtractConfig {
    selector: string;
    attr?: string;
    multiple?: boolean;
    transform?: (value: any) => any;
  }

  export interface ExtractSchema {
    [key: string]: string | ExtractConfig;
  }

  export interface LinkObject {
    text: string;
    href: string | null;
    title: string | null;
  }

  export interface ImageObject {
    src: string | null;
    alt: string | null;
    title: string | null;
  }

  export class Fetcher {
    constructor(options?: FetcherOptions);
    get(url: string, options?: FetchOptions): Promise<string>;
    post(url: string, data?: any, options?: FetchOptions): Promise<string>;
    setHeaders(headers: Record<string, string>): void;
    setTimeout(ms: number): void;
  }

  export class Parser {
    constructor(html?: string);
    load(html: string): Parser;
    querySelector(selector: string): any;
    querySelectorAll(selector: string): any[];
    text(selector: string): string;
    textAll(selector: string): string[];
    attr(selector: string, attr: string): string | null;
    attrAll(selector: string, attr: string): string[];
    html(selector: string): string;
    outerHtml(selector: string): string;
    getTitle(): string;
    getMeta(name: string): string;
    getLinks(): LinkObject[];
    getImages(): ImageObject[];
    extract(schema: ExtractSchema): Record<string, any>;
    getRawHtml(): string;
  }

  export class Manipulator {
    static stripTags(html: string): string;
    static decodeEntities(html: string): string;
    static extractUrls(html: string, baseUrl?: string): string[];
    static cleanWhitespace(text: string): string;
    static extractEmails(html: string): string[];
    static truncate(text: string, length: number, suffix?: string): string;
    static toAbsoluteUrl(url: string, baseUrl: string): string;
    static extractStructuredData(html: string): object[];
    static removeScriptsAndStyles(html: string): string;
    static wordCount(text: string): number;
    static sanitizeFilename(filename: string): string;
  }

  export default class HtmlFetchParser {
    constructor(options?: FetcherOptions);
    fetch(url: string, options?: FetchOptions): Promise<HtmlFetchParser>;
    post(url: string, data?: any, options?: FetchOptions): Promise<HtmlFetchParser>;
    load(html: string): HtmlFetchParser;
    $(selector: string): any;
    $$(selector: string): any[];
    text(selector: string): string;
    textAll(selector: string): string[];
    attr(selector: string, attr: string): string | null;
    attrAll(selector: string, attr: string): string[];
    html(selector: string): string;
    extract(schema: ExtractSchema): Record<string, any>;
    getTitle(): string;
    getMeta(name: string): string;
    getLinks(): LinkObject[];
    getImages(): ImageObject[];
    getRawHtml(): string;
  }

  export function fetch(url: string, options?: FetcherOptions): Promise<HtmlFetchParser>;
  export function load(html: string): HtmlFetchParser;
}
