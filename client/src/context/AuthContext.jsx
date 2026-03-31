import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState([]);
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateprofile
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/users/getuser");
      if (data.success) {
        setAuthUser(data.data);
        connectSocket(data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (state, credentials) => {
    const { data } = await axios.post(`/users/${state}`, credentials);
    try {
      if (data.success) {
        setAuthUser(data.data);
        connectSocket(data.data);
        axios.defaults.headers.common["token"] = data.data.accessToken;
        setToken(data.data.accessToken);
        localStorage.setItem("token", data.data.accessToken);
        toast.success(data.data.message);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/users/logout");
      localStorage.removeItem("token");
      setAuthUser(null);
      setToken(null);
      setOnlineUsers([]);
      axios.defaults.headers.common["token"] = null;
      toast.success("logged out successfully");
      socket.diconnect();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateprofile = async(body)=>{
    try {
        const {data} = await axios.patch("/users/updateprofile",body)
        if(data.success){
            setAuthUser(data.data)
            toast.success("profile update successful")
        }

    } catch (error) {
        toast.error(error.message)
    }

 
  }

  // connect socket function to handle socket function and update online users
  const connectSocket = (userData) => {
    if (!userData || !socket?.connected) return;
    //Create a new socket connection
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token; // Every request you send using Axios will automatically include token: your_token_value
    }
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ value }}>{children}</AuthContext.Provider>
  );
};

export const context = () => {
  return useContext(AuthContext);
};
