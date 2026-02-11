import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";
import { openVoting, closeVoting, getVotingStatus } from "../controllers/votingStatus.controller.js";

const router = Router()

router.route("/open").post(
    verifyJWT, authorizeRoles("admin"), openVoting
)

router.route("/close").post(
    verifyJWT, authorizeRoles("admin"), closeVoting
)

router.route("/status").get(
    getVotingStatus
)

export default router;