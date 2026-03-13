import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {
  const[currState,setCurrstate] = useState("sign-up")
  const[fullName,setFullname] = useState("")
  const[Email,setEmail] = useState("")
  const[Bio,setBio] = useState("")
  const[Password,setPassword] = useState("")
  const[isDataSubmitted,setisDataSubmitted] = useState("")

  const onHandleSubmit=(event)=>{
    event.preventDefault()

    if(currState === "sign-up" && !isDataSubmitted){
      setisDataSubmitted(true)
    }

  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8
    backdrop-blur-2xl sm:justify-evenly max-sm:flex-col '>
      {/* ---left---- */}
      <img src={assets.logo_big} alt='' className='max-w-50'/>
      {/* ----right---- */}
      <form onSubmit={onHandleSubmit} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
       <h2 className='flex justify-between align-item font-bold'>{currState}
        {isDataSubmitted && <img src={assets.arrow_icon} onClick={()=>{setisDataSubmitted(false)}} className='w-5 cursor-pointer'/>}
       
       </h2>
       {currState === "sign-up" && !isDataSubmitted && (
        <input onChange={(e)=>{setFullname(e.target.value)}} value={fullName} type='text' className='p-2 border border-gray-500 rounded-md focus:outline-none
        'placeholder='Full Name' required/>
       )}
       {!isDataSubmitted && (
        <>
        <input onChange={(e)=>{setEmail(e.target.value)}} value={Email} type='email'placeholder='Email' required className='p-2 border border-gray-500 rounded-md focus:outline-none'/>
        <input onChange={(e)=>{setPassword(e.target.value)}} value={Password} type='password'placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none'/>
        </>
       )}
       {currState === "sign-up" && isDataSubmitted && (
        <textarea onChange={(e)=>{setBio(e.target.value)}} value={Bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none
        ' placeholder='provide a short bio' required>
        </textarea>
       )}

       <button type='text' className='py-3 bg-gradient-to-r from-purple-200 to violet-600 text-white rounded-md cursor-pointer'>
         {currState === "sign-up" ? "create account" : "login now"}
       </button>

       <div className='flex gap-1'>
        <input type='checkbox'/>
        <p>Agree to the terms & use of policy</p>
       </div>
       <div className='flex flex-col gap-2'>
        {currState === "sign-up"?(
          <p className='text-sm text-gray-600'> Already have an account? <span
          onClick={()=>{setCurrstate("login"); setisDataSubmitted(false)}}
          className='font-medium text-violet-500 cursor-pointer'>Login here</span>
          </p>
        ):( <p className='text-sm text-gray-600'> Create an account <span
          onClick={()=>{setCurrstate("sign-up")}}
          className='font-medium text-violet-500 cursor-pointer'>Sign-up here</span>
          </p>)}
       </div>
      </form>

    </div>
  )
}

export default LoginPage