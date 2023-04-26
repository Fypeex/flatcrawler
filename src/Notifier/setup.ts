import fs from "fs";
import path from "path";
import * as process from "process";

import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis'

export class Google {
    private _SCOPES: string[] = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send'
    ];
    private _TOKEN_PATH: string = path.join(process.cwd(), 'token.json');
    private _CREDENTIALS_PATH: string = path.join(process.cwd(), 'credentials.json');
    async authorize() {
        let client:any = await this.loadSavedCredentialsIfExist();
        if (client) {
            console.log("Client", client);
            return client;
        }
        client = await authenticate({
            scopes: this._SCOPES,
            keyfilePath: this._CREDENTIALS_PATH,
        });
        console.log("Client", client);
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }
    loadSavedCredentialsIfExist() {
        try {
            const content = fs.readFileSync(this._TOKEN_PATH, 'utf8');
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }
    /**
     * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    saveCredentials(client:any) {
        const content = fs.readFileSync(this._CREDENTIALS_PATH, 'utf8');
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        fs.writeFileSync(this._TOKEN_PATH, payload);
    }
    async listLabels(auth:any) {
        const gmail = google.gmail({version: 'v1', auth});
        const res = await gmail.users.labels.list({
            userId: 'me',
        });
        const labels = res.data.labels;
        if (!labels || labels.length === 0) {
            console.log('No labels found.');
            return;
        }
        console.log('Labels:');
        labels.forEach((label:any) => {
            console.log(`- ${label.name}`);
        });
    }
}

