import jwt from "jsonwebtoken"
import Author from "../models/authors.js"

export const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization
    try {
        const payload = jwt.verify(token, "SEGRETO")

        req.user = await Author.findById(payload.id).select("-password")

        if (!req.user) {
            return res.status(404).json({ message: "User not found" })
        }

        next()
    } catch (error) {
        next(error)
    }
}
