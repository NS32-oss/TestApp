import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  // console.log(" Email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All Fields is required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new apiError(409, "User Already Exist");
  }

  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path;
  }
  

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
  const createdUser=await User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new apiError(500,"Error in creating user");
  }

  // return new apiResponse(200, "User registered successfully", createdUser);
return res.status(201).json(new apiResponse(200, "User registered successfully", createdUser));




});

export { registerUser };
