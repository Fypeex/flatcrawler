import {Endpoint} from "../types/Endpoint.js";
import * as fs from "fs";
import fetch, {FetchError, Response} from "node-fetch";
import {Flat, FlatResponse, FlatResponseFlatfox, FlatResponseHomegate} from "../types/Flat.js";
import {FlatFoxResult} from "../types/FlatFoxResult.js";
import {Parser} from "../Parser.js";
import {Storage} from "./Storage.js";
import {FlatSetEvent} from "../types/CustomSet.js";
import {ImmoscoutResult} from "../types/ImmoscoutResult.js";

export class Crawler {
    private _persistentStorage: Storage<Flat>;
    private _endpoints: Endpoint[] = [];
    private _consecutiveErrors: number = 0;
    private _lastErrors: any[] = [];

    constructor() {
        this.loadEndpoints();
        this._persistentStorage = new Storage<Flat>("flats.txt");
    }

    public loadEndpoints(): void {
        this._endpoints = JSON.parse(fs.readFileSync("./properties.json", "utf-8"));
    }

    public start(): void {
        const shiftError = (error: any) => {
            this._lastErrors.shift();
            this._lastErrors.push(error);
        }

        try {
            setInterval(() => {

                this._endpoints.forEach((endpoint) => {
                    this.fetchResults(endpoint)
                        .then((result) => {
                            this.processResults(endpoint, result);
                        });
                });
                this._consecutiveErrors = 0;
            }, parseInt(process.env["CRAWLER_INTERVAL"] || "20000"));

            this._endpoints.forEach((endpoint) => {
                this.fetchResults(endpoint)
                    .then((result) => {
                        this.processResults(endpoint, result);
                    });
            });

        } catch (error) {
            if (this._consecutiveErrors > 10) {
                console.error("Too many consecutive errors, exiting...");
                process.exit(1);
            } else {
                this._consecutiveErrors++;
                if (this._lastErrors.length > 10) shiftError(error);
                else this._lastErrors.push(error);
            }
        }
    }

    public fetchResults(endpoint: Endpoint): Promise<any> {
        const url = endpoint.url;
        const method = endpoint.type === "API-POST" ? "POST" : "GET";
        const args = endpoint.arguments;

        switch (method) {
            case "GET": {
                const urlParams = Object.keys(args).map((key) => {
                    return key + "=" + args[key]
                }).join("&");
                return this.GET(url + "?" + urlParams);
            }
            case "POST": {
                return this.POST(url, args);
            }
        }
    }

    private async fetchFlat(endpoint: Endpoint, id: string): Promise<any> {
        switch (endpoint.sitename) {
            case "flatfox": {
                return this.GET(endpoint.result.flatEndpoint + id);
            }
        }
    }

    private async GET(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response: Response) => {
                    return response.json();
                })
                .then((json: any) => {
                    resolve(json);
                })
                .catch((error: FetchError) => {
                    reject(error);
                })
        })
    }

    private async POST(url: string, args: any): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                body: JSON.stringify(args)
            })
                .then((response: Response) => {
                    return response.json();
                })
                .then((json: any) => {
                    resolve(json);
                })
                .catch((error: FetchError) => {
                    reject(error);
                })
        });
    }

    private processResults(endpoint: Endpoint, result: any): void {
        if (endpoint.result.implicit) this.processResultsImplicit(endpoint, result);
        else this.processResultsExplicit(endpoint, result);
    }

    private processResultsImplicit(endpoint: Endpoint, result?: FlatResponse | ImmoscoutResult, flat?: FlatFoxResult): void {
        switch (endpoint.sitename) {
            case "homegate": {
                result = result as FlatResponseHomegate;
                result.results.forEach((flat: Flat) => {
                    flat.website = "homegate";
                    flat.link = "https://www.homegate.ch/mieten/" + flat.id;
                    this._persistentStorage.addData(flat);
                });
                break;
            }
            case "flatfox": {
                const parsed: Flat = Parser.parseFlatFoxToFlat(flat as FlatFoxResult);
                this._persistentStorage.addData(parsed);
                break;
            }
            case "immoscout": {
                console.log("SIZE", (result as ImmoscoutResult).pagingInfo.itemsOnPage)
                for (const property of (result as ImmoscoutResult).properties) {
                    if(property.priceFormatted === "Price on request") {
                        console.log("Skipping")
                        continue
                    }
                    const parsed: Flat = Parser.parseImmoscoutToFlat(property);
                    this._persistentStorage.addData(parsed);
                }
                break;
            }
        }
    }

    on(event: FlatSetEvent, listener: (flat: Flat) => void) {
        this._persistentStorage.data.on(event, listener)
    }

    off(event: FlatSetEvent, listener: (flat: Flat) => void) {
        this._persistentStorage.data.off(event, listener)
    }

    private processResultsExplicit(endpoint: Endpoint, result: FlatResponse): void {
        switch (endpoint.sitename) {
            case "flatfox": {
                result = result as FlatResponseFlatfox[];
                result.forEach((value: any & { pk: number }) => {
                    this.fetchFlat(endpoint, value.pk)
                        .then((flat: FlatFoxResult) => {
                            this.processResultsImplicit(endpoint, undefined, flat);
                        });
                });

            }
        }
    }
}