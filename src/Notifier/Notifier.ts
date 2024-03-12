import {Google} from "./Google.js";
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
        return new Promise((resolve, reject) => {
            try {
                if (!this.client) {
                    console.error("Google client not initialized");
                    return;
                }
                const mail: Mail = {
                    from: "me",
                    to: process.env["EMAIL_RECIPIENT"],
                    subject: "New flat found",
                }
                const message = Parser.parseFlatToEmail(mail, flat)
                const gmail = google.gmail({version: "v1", auth: this.client});
                const raw = Parser.parseEmailToRaw(message);

                if (!raw) {
                    reject("Could not parse email");
                    return;
                }
                gmail.users.messages.send({
                    userId: "me",
                    requestBody: {
                        raw
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        resolve(true);
                    }
                }).catch((error: any) => {
                    console.error(error);
                    reject(error);
                });
            } catch (error) {
                console.error(error);
                reject(error);
                return;
            }

        });
    }
}
