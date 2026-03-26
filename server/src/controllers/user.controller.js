import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

const signUp = asyncHandler(async (req, res) => {
  const { fullName, password, Bio, email } = req.body;

  if (
    [fullName, email, password].some((field) => {
      field?.trim == "";
    })
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = User.findOne({
    or: [{ fullName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with this email or password already exist");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file not uploaded");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file missing");
  }

  const user = await User.create({
    fullName,
    email,
    avatar: avatar.url,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const Login = asyncHandler(async (req, res) => {
  const { FullName, email, password } = req.body;

  if (!FullName && !email) {
    throw new ApiError(400, "email or FullName is missing");
  }

  const user = User.findOne({
    or: [{ FullName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user with this name or email not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials");
  }

  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        400,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "user logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }

    )

    const options={
        httpOnly:true,
        secure:true
    }

     return res 
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

export { signUp, Login ,logoutUser};
