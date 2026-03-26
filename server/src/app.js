import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"

const app = express()
// express cannot handle special HTTP request
// WebSockets need access to the HTTP server because they rely on a special “upgrade” request that only the HTTP server can handle.
const server = http.createServer(app) //It creates an HTTP server using Node.js and attaches your app to it

app.use(cors({

}))

app.use(express.json({limit:"4mb"})) //Parses incoming JSON request bodies Attaches the result to req.body
app.use(cookieParser()) //It tells Express Before any route runs, parse cookies and attach them to req.cookies

import userRouter from "./routes/user.route.js"

app.use("api/v1/users",userRouter)


export default app