import express from "express"
import "dotenv/config"
const app=express()
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js"
const PORT=process.env.PORT
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import  cors  from "cors";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running in port no ${PORT}`)
    connectDB()
    
})