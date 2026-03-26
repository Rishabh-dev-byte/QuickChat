import { Router } from "express";
import {signUp} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/signup").post(
    upload.single("avatar"),signUp
)

export default router