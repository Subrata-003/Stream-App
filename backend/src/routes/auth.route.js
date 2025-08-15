import express from "express"
import { login, logout, signup,onboard } from "../controllers/auth.controller.js"
const router=express.Router()
import { protectRoute } from "../middleware/auth.middleware.js"





router.post("/login",login)


router.post("/signup",signup)
router.post("/logout",logout)
router.post("/onboarding",protectRoute,onboard)

router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});


export default router