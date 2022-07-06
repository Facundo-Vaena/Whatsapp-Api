import {Router, Request, Response} from "express";
import { sendMessage } from "../services/baseMethods";
const router = Router();

router.post("/:instanceId", async ({ body: {addresseeId, message}, params }: Request, res: Response) => {
    const { instanceId } = params;
    console.log("input data: ", instanceId, addresseeId, message);
    const messageSent = await sendMessage(instanceId, addresseeId, message);
    res.json({status: 200, data: messageSent});
})

export default router;