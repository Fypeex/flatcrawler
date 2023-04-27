import {Application} from "./Application.js";

import * as dotenv from "dotenv";
dotenv.config();
const app: Application = new Application();
try {
    app.start();
}catch (error) {
    console.error(error);
}
