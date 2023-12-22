import express from "express"
import list from "express-list-endpoints"
import mongoose from "mongoose"
import { config } from "dotenv"
import apiRoute from "./Routes/apiRoute.js"
import {
    genericError,
    unauthorizedError,
    badRquestError,
    notFoundError,
} from "./middlewares/ErrorHandlers.js"
import cors from "cors"
config()

const server = express()
const port = process.env.PORT || 3001

server.use(express.json())

/* let whiteList = ["http://localhost:5173"]
let corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not Allowed by CORS"))
        }
    },
} */
server.use(cors())

server.use("/api", apiRoute)

server.use(notFoundError) // 404
server.use(unauthorizedError) // 401
server.use(badRquestError) // 400
server.use(genericError) // 500 (Always LAST ERROR)

const InitServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("🌚 The server has successfully connected to mongodb.")

        server.listen(port, () => {
            console.log(
                "🚀 Server listening to port: " +
                    port +
                    "!" +
                    "\n🌝 The server has these endpoints: \n"
            )
            console.table(list(server))
        })
    } catch (error) {
        console.log("❌ CONNECTION FAILED! Error: ", error)
    }
}

InitServer()
