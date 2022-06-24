import { Request, Response, Router } from "express";
// import { setConnection } from "../folder/whatsapp";
import { WhatsappInstance } from "../folder/whatsapp";
import { createConnection, getQrCode } from "../services/baseMethods";
const fs = require("fs");
const router = Router();

router.get("/", async (req: Request, res: Response) => {

    const registrationId = await createConnection();
    res.json({ registrationId });

});


router.get("/qr/:instanceId", async ({ params }: Request, res: Response) => {
    const { instanceId } = params;
    const qr = await getQrCode(instanceId);
    res.json({qr});
})


export default router;