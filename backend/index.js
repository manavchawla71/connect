import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import path from "path";
import authroutes from "./routes/auth.js";
import userroutes from "./routes/user.js";
import postroutes from "./routes/posts.js";
import { verifytoken } from "./middleware/auth.js";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createpost } from "./controllers/posts.js";
import Post from "./models/Post.js";
import User from "./models/User.js";
import { users, posts } from "./data/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifytoken, upload.single("picture"), createpost);
app.use("/auth", authroutes);
app.use("/users", userroutes);
app.use("/posts", postroutes);
const PORT = 3000;
mongoose
  .connect(
    `mongodb+srv://chawlamanav71:${process.env.MONGO_URI}@cluster0.jgpp4jq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    Post.insertMany(posts);
    User.insertMany(users);
  })
  .catch((error) => console.log(`${error} did not connect`));
