import { Response, Request, Router } from "express";
import loginRoutes from "./loginRoutes";
import userDataRoutes from "./userDataRoutes";
const router = Router();

router.get("/", (req: Request, res: Response) => res.send("OK"));
router.use("/login", loginRoutes);
router.use("/userData", userDataRoutes);

export default router;