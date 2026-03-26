import { Router } from "express";
import {Login, logoutUser, signUp} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/signup").post(
    upload.single("avatar"),signUp
)

router.route("/login").post(Login)
router.route("/logout").post(verifyJWT,logoutUser)
export default router

