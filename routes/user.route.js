import { Router } from "express";
import { register, login, getProfile, logout, changePassword, updateAccountDetails } from "../controllers/user.controller.js";
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.route("/register").post(
   register
)

router.route("/login").post(
    login
)

router.route("/profile").get(
    verifyJWT, getProfile
)

// admin only can access
router.get("/admin-dashboard", verifyJWT, authorizeRoles("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

// voter only can access
router.get("/voter-dashboard", verifyJWT, authorizeRoles("voter"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Voter Dashboard",
    user: req.user,
  });
});

router.route("/logout").get(
  verifyJWT, logout
)

router.route("/change-password").post(
  verifyJWT, changePassword
)

router.route("/update-account-details").patch(
  verifyJWT, updateAccountDetails
)
export default router;