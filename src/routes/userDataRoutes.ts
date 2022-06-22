import { Router, Request, Response } from "express";
// import { getChats, getContacts } from "../folder/whatsapp";
import { findContacts, findChats } from "../services/baseMethods";
const router = Router();

router.get("/:instanceId", async ({ params }: Request, res: Response) => {
    const { instanceId } = params;
    console.log(params, "paarams");
    const userContacts = await findContacts(instanceId);
    const userChats = await findChats(instanceId);
    // const instance = WhatsappInstances[instanceId];
    // const userContacts = await instance?.getContacts();
    // console.log("contacts from method: ", userContacts);
    res.json({userContacts, userChats});
})

export default router;