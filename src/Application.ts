import {Crawler} from "./Crawler/Crawler.js";
import {Notifier} from "./Notifier/Notifier.js";

export class Application {
    private _crawler: Crawler;
    private _notifier: Notifier;
    constructor(c:Crawler = new Crawler()) {
        this._crawler = c;
        this._notifier = new Notifier();
        this._notifier.init().then(() => {
            this._notifier.notify();
        });
    }

    public start(): void {
        this._crawler.on("new-added", (flat) => {
            console.log("Added new flat",flat.id);
        });



        this._crawler.start();
    }
}