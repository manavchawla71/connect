import express from "express";
import {
  getfeedposts,
  getUserposts,
  likepost,
} from "./../controllers/posts.js";
import { verifytoken } from "../middleware/auth.js";
const router = express.Router();

router.get("/posts", verifytoken, getfeedposts);
router.get("/:userid/posts", verifytoken, getUserposts);
router.patch("/:id/like", verifytoken, likepost);

export default router;
