import {Google} from "./setup.js";
import {btoa} from "buffer";
import {google} from "googleapis";

export class Notifier {
    private googleClient = new Google();
    private client: any;

    constructor() {

    }
    public async init() {
        this.client = await this.googleClient.authorize();
    }
    public sendOk(): void {
        console.log("Sending ok")
    }

    public async notify() {
        if(!this.client) {
            console.log("Client not ready");
            return;
        }
        const message = 'From: "Flat Finder" ffel.wg@gmail.com' + "\r\n" +
            'To:ffel.wg@gmail.com' + "\r\n" +
            'Subject: New flat' + "\r\n\r\n" +
            `New flat found at ${new Date()}`
        const gmail = google.gmail({version: "v1", auth: this.client});
        const raw = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw
            }
        }).then((res) => {
            console.log(res);
        });


    }
}