import {Google} from "./Google";
import {google} from "googleapis";
import {Parser} from "../Parser.js";
import {Flat} from "../types/Flat.js";
import {Mail} from "../types/Mail.js";

export class Notifier {
    private googleClient = new Google();
    private client: any;

    public async init() {
        this.client = await this.googleClient.authorize();
    }

    public async notify(flat: Flat) {
        if (!this.client) {
            console.error("Google client not initialized");
            return;
        }
        const mail: Mail = {
            from: "me",
            to: process.env["EMAIL_RECIPIENT"] || "ffel.wg@gmail.com",
            subject: "New flat found",
        }
        const message = Parser.parseFlatToEmail(mail, flat)
        const gmail = google.gmail({version: "v1", auth: this.client});
        const raw = Parser.parseEmailToRaw(message);
        gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw
            }
        }).catch((error: any) => {
            console.error(error);
        });
    }
}