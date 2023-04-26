import {Endpoint} from "./types/Endpoint.js";
import * as fs from "fs";
import fetch, {FetchError, Response} from "node-fetch";
import {Flat} from "./types/Flat";
import {FlatSet} from "./types/CustomSet";

export class Application {
    constructor() {
        this.loadEndpoints();
    }

    private _endpoints: Endpoint[] = [];
    private _consecutiveErrors: number = 0;
    private _lastErrors: any[] = [];

    private _storedFlatIds: FlatSet = new FlatSet();

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
            }, 1000 * 60 * 5);

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
    public async fetchResults(endpoint: Endpoint): Promise<any> {
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

    private processResultsImplicit(endpoint: Endpoint, result: Flat | any): void {
        switch (endpoint.sitename) {
            case "homegate": {
                result.forEach((flat: Flat) => {
                    if(this._storedFlatIds.addFlat(flat)) {
                        console.log("ADDED NEW FLAT", flat);
                    };
                });

            }
        }
    }

    private processResultsExplicit(endpoint: Endpoint, result: any): void {
        console.log(endpoint.url, result);
    }
}