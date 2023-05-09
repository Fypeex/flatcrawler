import {Crawler} from "./Crawler/Crawler.js";
import {Notifier} from "./Notifier/Notifier.js";

export class Application {
    private _crawler: Crawler;
    private _notifier: Notifier;
    constructor(c:Crawler = new Crawler()) {
        this._crawler = c;
        this._notifier = new Notifier();
    }

    public async start(): Promise<void> {
        await this._notifier.init().catch((err) => {
            console.error(err);
            process.exit(1);
        }).finally(() => {
            console.log("Notifier initialized");
        });
        this._crawler.on("new-added", (flat) => {
            return new Promise<boolean>((resolve, reject) => {
                console.log("New flat added");
                this._notifier.notify(flat).then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(false);
                    console.error(err);
                })
            });
        });
        this._crawler.start();
    }
}