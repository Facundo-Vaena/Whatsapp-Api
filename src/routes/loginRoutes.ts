import { Request, Response, Router } from "express";
// import { setConnection } from "../folder/whatsapp";
import { WhatsappInstance } from "../folder/whatsapp";
const fs = require("fs");
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const connection = new WhatsappInstance(); 
    const data = await connection.init();
    const qrCode = connection.qrCode;

    const { registrationId } = connection.connection.authState.creds;   
    WhatsappInstances[registrationId] = connection;
    
    console.log("data: ", data);
    console.log("connection: ", connection);


    res.json({ qrCode, registrationId });
    // const connection = new WhatsappInstance();
    // const response: any = await connection.setConnection();
    // console.log(connection, "clase instanciada");
    // const { qrCode } = response;
    // const { registrationId } = connection.connection.authState.creds;
    // WhatsappInstances[registrationId] = connection;

    // res.json({ qrCode, registrationId });
});


router.get("/qr/:instanceId", async ({ params }: Request, res: Response) => {
    const { instanceId } = params;
    console.log("instanceId: ", instanceId);
    const qr = await WhatsappInstances[instanceId]?.qrCode;
    console.log(WhatsappInstances[instanceId], "instancia especifica");
    console.log("qrrr: ", qr);
    res.json({qr});
})


export default router;