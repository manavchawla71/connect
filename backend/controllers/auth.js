import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./../models/User.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt); // Corrected variable name
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash, // Store the hashed password
    });
    const savedUser = await newUser.save(); // Wait for the user to be saved
    res
      .status(200)
      .json({ message: "User saved successfully", user: savedUser }); // Corrected response syntax
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User doesnt exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json(400).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
