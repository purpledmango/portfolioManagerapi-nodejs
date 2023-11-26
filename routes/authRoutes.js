import {Router} from "express";
import { loginController, signupController } from "../controllers/authControllers.js";
const router = Router()

router.post("/login", loginController);
// router.post("/logout", logoutController);
router.post("/signup", signupController);
// router.delete("/delete", deleteController);
// router.put("/update", updateController);

export default router;


