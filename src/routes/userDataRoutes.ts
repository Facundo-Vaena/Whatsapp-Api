import { Router, Request, Response } from "express";
// import { getChats, getContacts } from "../folder/whatsapp";
const router = Router();

router.post("/", async ({ body }: Request, res: Response) => {
    // console.log("req at route: ", Object.keys(req));
    const { instanceId } = body;
    // console.log(body, "booody");
    const instance = WhatsappInstances[instanceId];
    const userContacts = await instance.getContacts();
    // const userContacts = await getContacts(body.instanceId);
    console.log("contacts from method: ", userContacts);
    console.log("contacts from class property: ", instance.contacts);
    // console.log(WhatsappInstances, "wppInstancesss");
    res.json(userContacts);
})

export default router;