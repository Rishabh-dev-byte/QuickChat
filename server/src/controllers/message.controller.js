import { Message } from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import {io,userSocketMap} from "../app.js"


const getUsersForSidebar = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    if(!userId){
        throw new ApiError(400,"logged in userId is missing")
    }
    const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password")

    const unseenMessages={}
    const promise = filteredUsers.map(async(user)=>{
        const messages = await Message.find({senderId:user._id, receiverId:userId,seen:false})
        if(messages.length>0){
            unseenMessages[user._id] = messages.length
        }
    }
    )
    await Promise.all(promise)
    res.status(200).json(new ApiResponse(200,{filteredUsers,unseenMessages},"unseen messages found successfully"))
})

const getMessages = asyncHandler(async(req,res)=>{
    const {id:selectedUser} = req.params
    const userId = req.user._id

    const messages =await Message.find({$or:[{senderId:selectedUser,receiverId:userId},{senderId:userId,receiverId:selectedUser}]})
    
    await Message.updateMany({senderId:selectedUser,receiverId:userId},{seen:true})

    return res.status(200).json(new ApiResponse(200,messages,"messages for selected user fetched successfully"))
})

const toggleSeen = asyncHandler(async(req,res)=>{
      const {userId} = req.params
      
      const toggle = await Message.findByIdAndUpdate(userId,{$set:{
        seen:true
      }},{new:true})

      return res.status(200).json(new ApiResponse(200,toggle,"message toggled"))
})

const sendMessage = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {text} = req.body

    if(!id || !text){
        throw new ApiError(400,"id or message is missing")
    }

    const message = await Message.create({
          senderId:req.user._id,
          receiverId:id,
          text
    })

    //emit new message to the receiver

    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId){
        io.to(receiverSocketId).emit("message",message)
    }

    const createdMsg = await Message.findById(message._id)

    if(!createdMsg){
        throw new ApiError(500,"message not created")
    }

    return res.status(200).json(new ApiResponse(200,createdMsg,"message created successfully"))
})

const sendMedia = asyncHandler(async(req,res)=>{
    const {id} = req.params
    
    const mediaLocalPath = req.file?.path

    if(!mediaLocalPath){
        throw new ApiError(400,"local path missing")
    }

    const media = await uploadOnCloudinary(mediaLocalPath)

    if(!media?.url){
        throw new ApiError(400,"media file missing")
    }

    if(!id){
        throw new ApiError(400,"id is missing")
    }

    const message = await Message.create({
          senderId:req.user._id,
          receiverId:id,
          image:media.url
    })

     //emit new message to the receiver

    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId){
        io.to(receiverSocketId).emit("message",message)
    }

    const createdMsg = await Message.findById(message._id)

    if(!createdMsg){
        throw new ApiError(500,"message not created")
    }

    return res.status(200).json(new ApiResponse(200,createdMsg,"message created successfully"))
})
export {
   getUsersForSidebar,
   getMessages,
   toggleSeen,
   sendMessage,
   sendMedia
}
