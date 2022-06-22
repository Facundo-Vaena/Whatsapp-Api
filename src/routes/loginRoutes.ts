import { Request, Response, Router } from "express";
// import { setConnection } from "../folder/whatsapp";
import { WhatsappInstance } from "../folder/whatsapp";
const fs = require("fs");
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    // const response: any = await setConnection();
    const connection = new WhatsappInstance();
    const response: any = await connection.setConnection();
    console.log(connection, "clase instanciada");
    const { qrCode } = response;
    const { registrationId } = connection.connection.authState.creds;
    WhatsappInstances[registrationId] = connection;
    // console.log(this.connection.authState.creds, "credenciales");

    res.json({ qrCode, registrationId });
    console.log("response: ", response);   
    console.log("eeev: ", response.socket.ev); 
    console.log("qrrr: ", qrCode);
    // fs.readFile("../qrcode.json", "utf8", (err: any, data: any) => {
    //     console.log("dataaa: ", data);
    // })
    // const chats = await instance.getChats(socket);
    // console.log("chats: ", chats);
    // console.log("qr recibido: ", qrCode);
    // fs.readFile("../qrcode.json", (err: any, data: any) => {
    //     if (err) throw err;
    //     console.log("data: ", data);
    // })
    // setConnection().then(({ socket, qrCode }: any) => {
    //     const algo = fs.readFileSync("../qrcode.json", "utf8");
    //     console.log("algo: ", algo);
    //     res.json(algo);
    // })
    // const qrExistence = fs.existsSync("../qrcode.json");
    // if (qrExistence) {
    //     console.log("existe qr");
    //     const algo = fs.readFileSync("../qrcode.json", "utf8");
    //     console.log("algo: ", algo);
    // }
    // res.json({qrCode})
    // res.json(chats);
});


export default router;