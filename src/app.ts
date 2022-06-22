import router from "./routes";
import cors from "cors";
const express = require('express');
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", [router])

app.listen(3003, () => {
    console.log("listening at por 3003!");
});
declare global {
    var WhatsappInstances: any
};

global.WhatsappInstances = {};
