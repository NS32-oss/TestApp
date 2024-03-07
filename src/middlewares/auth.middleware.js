import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import apiError from "../utils/apiError.js";



export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new apiError(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, "Invalid Token");
  }
});
