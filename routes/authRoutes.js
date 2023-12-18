import { Router } from "express";
import {
    loginController,
    signupController,
    updateUserController,
    logoutController,
    fetchUserController,
    showLeadsController,
    deleteLeadsController,
    addUserController,
    deleteUserController,
    updateLeadController,
    fetchAllUsers
} from "../controllers/authControllers.js";

const router = Router();

router.post("/login", loginController);
router.get("/logout", logoutController);
router.post("/signup", signupController);
router.put("/update-user", updateUserController);
router.get("/get-user", fetchUserController);
router.get("/get-all-users", fetchAllUsers);
router.get("/show-leads", showLeadsController);
router.delete("/delete-leads", deleteLeadsController);
router.post("/add-user", addUserController);
router.delete("/delete-user", deleteUserController);
router.put("/update-lead", updateLeadController);

export default router;
