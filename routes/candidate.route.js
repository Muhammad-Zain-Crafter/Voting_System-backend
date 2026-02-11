import {Router} from 'express';
import multer from 'multer';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/roles.middleware.js';
import { createCandidate, deleteCandidate, getAllCandidates, getCandidateById, updateCandidate, voteForCandidate, votesCount } from '../controllers/candidate.controller.js';

const router = Router();
const upload = multer(); 

router.route("/c").get(
    getAllCandidates 
)
router.route("/c/:candidateId").get(
    getCandidateById
);
router.route("/create-candidate").post(
    verifyJWT, authorizeRoles("admin"), upload.none(), createCandidate
)
router.route("/c/:candidateId").patch(
    verifyJWT, authorizeRoles("admin"), updateCandidate
)
.delete(
    verifyJWT, authorizeRoles("admin"), deleteCandidate
)
router.route("/vote/:candidateId").post(
    verifyJWT, authorizeRoles("voter"), voteForCandidate
)
router.route("/vote/count").get(
    votesCount
)
export default router;