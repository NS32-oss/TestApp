import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log(" Email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All Fields is required");
  }

  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new apiError(409, "User Already Exist");
  }

  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new apiError(500, "Error in uploading avatar");
  }
  const user=await User.create({
    fullName,
    email,
    username,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url||"",
  });
  const createdUser=User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new apiError(500,"Error in creating user");
  }

  return apiResponse(200, "User registered succesfully",createdUser);
  // return res.status(200).json({
  //  new apiResponse(200, "User registered succesfully",createdUser),
  // });



});

export { registerUser };
