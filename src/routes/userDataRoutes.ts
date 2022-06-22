import { Router, Request, Response } from "express";
// import { getChats, getContacts } from "../folder/whatsapp";
const router = Router();

router.post("/", async ({ body }: Request, res: Response) => {
    // console.log("req at route: ", Object.keys(req));
    console.log(body, "booody");
    // const userContacts = await getContacts(body.sessionSocket);
    // console.log("contactsss: ", userContacts);
    res.send("hooolaaa");
})

export default router;