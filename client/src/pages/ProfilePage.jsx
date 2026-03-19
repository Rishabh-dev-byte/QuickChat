import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const[Profileimg,setProfileimg]=useState("")
  const[Bio,setBio]=useState("")
  const[Name,setName]=useState("")
  const navigate = useNavigate()

  const handleSubmit=(event)=>{
    event.preventDefault()
    navigate("/")
  }


  return (
    <div className='min-h-screen  bg-no-repeat bg-cover flex justify-center items-center'>
      <div className='flex w-5/6 max-w-2xl backdrop-blur-2xl border-b-emerald-100 border-2 justify-center rounded-2xl max-sm:flex-col-reverse items-center text-amber-100 '>
        <form className='p-10 gap-3 flex flex-col'onSubmit={handleSubmit}>
         <h3 className='text-lg mt-0'> Profile Detail</h3>
         
         <label htmlFor='image' className='flex gap-3 mt-2 '>
        <input onChange={(e)=>{setProfileimg(e.target.files[0])}} type="file" id="image" accept=".png .jpg .jpeg" hidden/>
        <img src={Profileimg?URL.createObjectURL(Profileimg):assets.avatar_icon} className={`w-12 h-12  cursor-pointer ${Profileimg && "rounded-full"}`}/>
         <p className='p-1.5'>update your profile</p>
         </label>
         <input type='text'  onChange={(e)=>{setName(e.target.value)}} value={Name} placeholder='enter your name' className='border-gray-400 border-2 rounded-lg mt-2 text-center rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' required></input>
         <textarea type='text' value={Bio} onChange={(e)=>{setBio(e.target.value)}} placeholder='enter your bio' row={4} className='border-gray-400 border-2 rounded-lg mt-2 text-center focus:outline-none focus:ring-2 focus:ring-violet-500' required></textarea>
         <button type='submit'className='border border-gray-200 rounded-xl'>Update Profile</button>
        </form>
        <img src={assets.logo_icon} className='w-60 p-5'></img>
          


      </div>
    </div>
  )
}

export default ProfilePage