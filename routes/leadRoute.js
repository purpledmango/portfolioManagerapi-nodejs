import { Router } from "express";
import { checkSessionMiddleware } from "../middleware/sessionMiddleware.js";
import { addLead, deleteLeadsController, fetchAllLeads, fetchUnreadLeads, getLeadController } from "../controllers/leadControllers.js";

const router = Router();

router.post("/add-lead", addLead)
router.get("/get-lead/:leadId", getLeadController)
router.delete("/delete-lead/:leadId", deleteLeadsController)
router.get("/unread-leads", fetchUnreadLeads)
router.get("/all-leads", fetchAllLeads)
// router.get("/update-lead", checkSessionMiddleware)


export default router;