import { Router } from "express";
import multer from "multer";
import { addDesign, getDesign, updateDesign, deleteDesign } from "../controllers/designControllers.js";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // Remove the original file extension from the image name
        const originalname = file.originalname.replace(/\.[^/.]+$/, "");

        // Add the original file extension and timestamp to the filename
        const extension = file.originalname.slice((file.originalname.lastIndexOf(".") - 1 >>> 0) + 2);
        cb(null, `${originalname}-${Date.now().toLocaleString()}.${extension}`);
    }
});

const multerStorage = multer({ storage: storage });

router.post("/add-design", multerStorage.single("image"), addDesign);
router.get('/get-design/:designId', getDesign)
router.put('/update-design/:designId', multerStorage.single("image"), updateDesign)
router.delete('/delete-design/:designId', deleteDesign)

export default router;
