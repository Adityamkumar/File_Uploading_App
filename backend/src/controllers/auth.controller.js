import userModel from "../models/user.model.js";
import { options as cookieOptions } from "../config/cookie.config.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Errror while generating Access and Refresh Token! ", error);
  }
};

export const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (typeof password != "string") {
      return res.status(400).json({
        message: "Password must be a string",
      });
    }

    const user = await userModel.create({
      email: email,
      password: password,
    });

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(201).json({
      message: "User register successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }
    const isPasswordMatched = await user.isPasswordCorrect(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await userModel
      .findById(user._id)
      .select("-password -refreshToken");

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      message: "User Logged In successfully",
      user: {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      message: "Unauthorized request",
    });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await userModel.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refreshToken",
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token is used or expired" });
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      accessToken,
      refreshToken: refreshToken,
      message: "access token refreshed",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

export const userLogout = async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
       message: "user logged out successfully"
    })
};

export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};
