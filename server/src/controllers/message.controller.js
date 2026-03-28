import { Message } from "../models/message.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


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
    const {id:id} = req.params
    const userId = req.user._id

    const messages =await Message.find({$or:[{senderId:id,receiverId:userId},{senderId:userId,receiverId:id}]})
    
    await Message.updateMany({senderId:id,receiverId:userId},{seen:true})

    return res.status(200).json(new ApiResponse(200,messages,"messages for selected user fetched successfully"))
})

const toggleSeen = asyncHandler(async(req,res)=>{
      const {id} = req.params
      
      const toggle = await Message.findByIdAndUpdate(id,{$set:{
        seen:true
      }},{new:true})

      return res.status(200).json(new ApiResponse(200,toggle,"message toggled"))
})

export {
   getUsersForSidebar,
   getMessages,
   toggleSeen
}
