import jwt from "jsonwebtoken"
import Author from "../models/authors.js"

export const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await Author.findById(payload.userId).select("-password")

        if (!req.user) {
            return res.status(404).json({ message: "User not found" })
        }

        next()
    } catch (error) {
        next(error)
    }
}
