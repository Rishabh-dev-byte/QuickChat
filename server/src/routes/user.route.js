import { Router } from "express";
import {changePassword, getCurrentUser, Login, logoutUser, signUp, updateProfile} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/signup").post(
    upload.single("avatar"),signUp
)

router.route("/login").post(Login)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/getuser").get(verifyJWT,getCurrentUser)
router.route("/changepassword").post(verifyJWT,changePassword)
router.route("/updateprofile").patch(verifyJWT,updateProfile)


export default router

