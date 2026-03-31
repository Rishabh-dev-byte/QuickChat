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
    const mediaLocalPath = req.file?.path

    if (!text && !mediaLocalPath) {
  throw new ApiError(400, "message cannot be empty");
}

    const sentFields={
          senderId:req.user._id,
          receiverId:id,
    }

    if(mediaLocalPath){
        const media = await uploadOnCloudinary(mediaLocalPath)
        if(!media?.url){
            throw new ApiError(400,"media not found")
        }
        sentFields.image = media.url
    }

    if(text){
        sentFields.text = text
    }
    const message = await Message.create(sentFields)

    //emit new message to the receiver

    const receiverSocketId = userSocketMap[id]
    if(receiverSocketId){
        io.to(receiverSocketId).emit("message",message)
    }

    

    return res.status(200).json(new ApiResponse(200,message,"message created successfully"))
})


export {
   getUsersForSidebar,
   getMessages,
   toggleSeen,
   sendMessage,
}
