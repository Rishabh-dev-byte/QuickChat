import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import io from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl
export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
      
      const[token,setToken] = useState(localStorage.getItem("token"))
      const[authUser,setAuthUser] = useState(null)
      const[onlineUsers,setOnlineUsers]=useState([])
      const[socket,setSocket] = useState([])
      const value={
         axios,
         authUser,
         onlineUsers,
         socket
      }

      const checkAuth = async()=>{
        try {
            const {data} = await axios.get(/users/getuser)
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
      }
      
      // connect socket function to handle socket function and update online users
      const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        //Create a new socket connection
        const newSocket = io(backendUrl,{
            query:{
                userId:userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)
        
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds)
        })
      }

      useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token // Every request you send using Axios will automatically include token: your_token_value
        }
        checkAuth();
      },[])
      return(
        <AuthContext.Provider value={{value}}>
            {children}
        </AuthContext.Provider>
      )

}

export const context =()=>{
    return useContext(AuthContext)
}