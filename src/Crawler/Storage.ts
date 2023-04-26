import fs from "fs";
import {Parser} from "../Parser";
import {CustomSet} from "../types/CustomSet.js";

export class Storage<T extends {
    id: string
}> {
    private readonly _base: string = "./data/";
    private readonly _fileName: string;
    private readonly _data: CustomSet<T>;
    private readonly _interval: NodeJS.Timeout;

    constructor(fileName:string) {
        this._fileName = fileName.toString();
        if(fs.existsSync(this.location)) {
            const data:T[] =  JSON.parse(Parser.parseBase64ToText(fs.readFileSync(this.location, "utf-8")));
            this._data = new CustomSet<T>(data);
        }else {
            fs.mkdirSync(this._base, {recursive: true});
            fs.writeFileSync(this.location, Parser.parseTextToBase64(JSON.stringify([])));
            this._data = new CustomSet<T>();
        }
        this._interval = setInterval(() => {
            this.synchronize();
        }, 1000 * 60);

        process.on("beforeExit", () => {
            this.synchronize();
        });
    }
    public clearInterval(): void {
        clearInterval(this._interval);
    }

    private synchronize() {
        fs.writeFileSync(this.location, Parser.parseTextToBase64(JSON.stringify(Array.of(this._data))));
    }
    public addData(data: T): boolean {
        if(this._data.add(data)) {
            this.synchronize();
            return true;
        }else return false;
    }

    public get location(): string {
        return this._base + this._fileName;
    }
    public get data(): CustomSet<T> {
        return this._data;
    }
}