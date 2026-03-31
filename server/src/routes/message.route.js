import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage, toggleSeen } from "../controllers/message.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
const router = Router();
router.route("/getsidebarusers").get(verifyJWT,getUsersForSidebar)
router.route("/getmessage/:selectedUser").get(verifyJWT,getMessages)
router.route("/toggle/:userId").patch(toggleSeen)
router.route("/sendmsg/:id").post(upload.single("media"),verifyJWT,sendMessage)



export default router