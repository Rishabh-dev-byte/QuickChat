import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import {Server} from socket.io

const app = express()
// express cannot handle special HTTP request
// WebSockets need access to the HTTP server because they rely on a special “upgrade” request that only the HTTP server can handle.
const server = http.createServer(app) //It creates an HTTP server using Node.js and attaches your app to it

//initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

// store online users 
export const userSocketMap = {}

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connected",userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    //emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("user disconnected")
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"4mb"})) //Parses incoming JSON request bodies Attaches the result to req.body
app.use(cookieParser()) //It tells Express Before any route runs, parse cookies and attach them to req.cookies

import userRouter from "./routes/user.route.js"
import messageRouter from "./routes/message.route.js"
app.use("/api/v1/users",userRouter) //It tells your Express app For any request that starts with api/v1/users pass control to userRouter.
app.use("/api/v1/messages",messageRouter)

export default app