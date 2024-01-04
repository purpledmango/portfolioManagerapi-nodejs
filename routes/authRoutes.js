import { Router } from "express";
import {
    loginController,
    signupController,
    updateUserController,
    logoutController,
    fetchUserController,
    addUserController,
    deleteUserController,
    getUsersControllers,

} from "../controllers/authControllers.js";

import { checkSessionMiddleware } from "../middleware/sessionMiddleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/logout", checkSessionMiddleware, logoutController);
router.put("/update-user/:username", checkSessionMiddleware, updateUserController);
router.delete("/delete-user/:username", deleteUserController);
router.get("/get-user/:username", checkSessionMiddleware, fetchUserController);
router.post("/add-user", checkSessionMiddleware, addUserController);
router.get("/get-users", checkSessionMiddleware, getUsersControllers);


export default router;
