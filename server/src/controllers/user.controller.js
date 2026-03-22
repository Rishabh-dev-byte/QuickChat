import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"



const signUp = asyncHandler(async(req,res)=>{

    const {fullName,password,Bio,email} = req.body

    if([fullName,email,password].some((field)=>{
        field?.trim == ""
    })){
        throw new ApiError(400,"all fields are required")
    }

    const existedUser = User.findOne({
        or:[{fullName}, {email}]
    })

    if(existedUser){
        throw new ApiError(409,"user with this email or password already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file not uploaded")
    }

    const avatar =  await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(400,"avatar file missing")
    }

    const user = await User.create({
        fullName,
        email,
        avatar:avatar.url,
        password
    })
     
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong")
    }

    return(
        res.status(200).json(
            new ApiResponse(200,createdUser,"user registered successfully")
        )
    )
})


