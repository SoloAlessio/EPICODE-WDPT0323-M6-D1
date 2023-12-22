import { checkAuth } from "../middlewares/authControl.js"
import express from "express"
import Author from "../models/authors.js"
import jwt from "jsonwebtoken"

const loginRoute = express.Router()

loginRoute.post("/", async (req, res, next) => {
    const { email, password } = req.body
    const user = Author.findOne({ email })
    if (!user) {
        return next(error)
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, "SEGRETO", { expiresIn: "1h" })
    res.status(200).json({ token: token })
})

loginRoute.get("/me", async (req, res, next) => {
    const { email, password } = req.body
    const user = Author.findOne({ email })

    if (!user) {
        return next(error)
    }

    const payload = { id: user._id }
    const token = jwt.sign
})

export default loginRoute
