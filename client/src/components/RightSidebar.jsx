import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'

const RightSidebar = ({selectedUser}) => {
  return  selectedUser &&(
    <div className={`bg-[#8185B2]/10 text-white w-full h-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='flex flex-col pt-16 items-center font-light mx-auto gap-2 text-xs'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} 
        className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 rounded-full bg-green-500'></p>
          {selectedUser.fullName}
        </h1>
        <p className="mx-auto">{selectedUser?.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4'></hr>
      <div className='px-5 text-xs '>
        <p>Media</p>
        <div className='mt-2 max-h-200 overflow-y-auto grid grid-cols-2 gap-4 opacity-80 mb-2'>
          {imagesDummyData.map((url,index)=>(
            <div key={index} onClick={()=>{window.open(url)}} 
            className='cursor-pointer rounded'>
            <img src={url} className="h-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <div className='flex absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 
      text-white border-none text-sm  font-light py-2 px-20 rounded-full cursor-pointer'>  
      <button>
      Logout
      </button>
      </div>
    
    </div>
    
  )
}

export default RightSidebar