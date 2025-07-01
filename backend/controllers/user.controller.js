import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadImage } from "../db/cloudinary.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation

    if (!name || !email || !password) {
      return res.json({ message: "All fields are required" });
    }

    // eexists user

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // hash password

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation

    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    // check user exists

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User not register" });
    }

    // compare password

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ message: "Invalid credentials" });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const options = {
      secure: true, // Use true if your site is served over HTTPS
      httpOnly: true,
      sameSite: "None", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};

// get user by id

export const getUserById = async (req, res) => {
  const id = req.user._id || req.user;
  try {
    const user = await userModel.findById(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
};

// user logout remove token form cookies

export const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      path: "/", // Must match the path used when setting the cookie
      httpOnly: true, // Only needed if you set it this way
      secure: true, // Only if set over HTTPS
      sameSite: "Strict", // Match the settings used when setting the cookie
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging out user",
      error: error.message,
    });
  }
};

// update profile

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateProfileData = { name, email };

    if (req.file) {
      const imageUrl = await uploadImage(req.file.path);
      updateProfileData.image = imageUrl.secure_url;
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,

      updateProfileData,

      { new: true }
    );

    res.status(200).json({ success: true, message: "User Updated", user });
  } catch (error) {
    console.log(error);
  }
};
