import express from "express";
import {
  getuser,
  getuserfriends,
  addRemoveFriends,
} from "./../controllers/user.js";
import { verifytoken } from "../middleware/auth.js";
const router = express.Router();
router.get("/:id", verifytoken, getuser);
router.get("/:id/friends", verifytoken, getuserfriends);
router.patch("/:id/:friendId", verifytoken, addRemoveFriends);
export default router;
