import {Router, router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getMessages, getUsersForSidebar, toggleSeen } from "../controllers/message.controller.js"
const router = Router()
router.route("/getsidebarusers").get(verifyJWT,getUsersForSidebar)
router.route("/:id").get(verifyJWT,getMessages)
router.route("/:id").patch(toggleSeen)

export default router