import React from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = ({setSelectedUser,selectedUser}) => {
  

  return selectedUser? (
     
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      <div className='flex gap-3 py-4 mx-3 items-center'>
        <img src={assets.profile_martin} alt='' className='w-8 rounded-full'/>
        <p className='text-amber-50 text-lg flex-1'> 
         Martin Johnson 
        <span className='w-2 h-2  bg-green-500 rounded-full'></span>
        </p>
        <img src={assets.arrow_icon} onClick={()=>{setSelectedUser(null)}} alt=''
         className='md:hidden max-w-7'/>
         <img src={assets.help_icon} alt='' className='max-md:hidden max-w-5 cursor-pointer'/>
      </div>
      {/* ---chat area----*/}
      <div   className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
       {messagesDummyData.map((msg,index)=>(
        <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse' }`}>
        {msg.image ? (
          <img src={msg.image} alt='' className='max-w-[230px] border border-gray-500 rounded-lg overflow-hidden mb-8'/>
        ):(
          <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === '680f50e4f10f3cd28382ecf9'? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text} 
          </p>
        )}
        <div className='text-center text-xs' >
        <img src={msg.senderId === '680f50e4f10f3cd28382ecf9'? assets.avatar_icon : assets.profile_martin } className="w-7 rounded-full"/>
        <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
        </div>  
        </div>
        ))}
        
      </div>
      <div className='absolute bottom-0 left-0 right-0 flex items-center  gap-3 p-3'>
       <div className=' flex-1 flex bg-gray-100/12 px-2 align-centre rounded-full gap-2'>
        <input type="text" placeholder='message'  className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
        <input type='text' id='image' accept='img/png, img/jpeg' hidden/>
        <label htmlFor="image">
          <img src={assets.gallery_icon} className='w-5 mr-2 mt-3 cursor-pointer'></img>
        </label>
       </div>
        <img src={assets.send_button} className='w-7 cursor pointer'/>
      </div>
     
    </div>
     ):(<div className='flex flex-col justify-center items-center text-gray-500 relative
      bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} alt='' className='max-w-15'/>
        <p className='text-lg text-white font-medium'>Chat Anytime,Anywhere</p>
     
   </div>)
}

export default ChatContainer