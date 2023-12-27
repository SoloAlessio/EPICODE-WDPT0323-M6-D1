import express from "express"
import Author from "../models/authors.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import passport from "passport"

const loginRoute = express.Router()

loginRoute
    .post("/", async (req, res, next) => {
        const { email, password } = req.body
        const user = await Author.findOne({ email })
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        const passwordControl = await bcrypt.compare(password, user.password)
        if (!passwordControl) {
            return res.status(401).send({ message: "Passwords do not match" })
        }
        const payload = { userId: user._id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })
        const response = { userId: user._id, token: token }
        res.status(200).json(response)
    })
    .post("/register", async (req, res) => {
        /* POST NEW AUTHOR */
        const password = await bcrypt.hash(req.body.password, 10)
        const user = await Author.findOne({ email: req.body.email })
        if (user) {
            return res.status(500).send("User already exists")
        }
        const newUser = await Author.create({ ...req.body, password: password })

        res.status(201).json(newUser)
    })
    .get(
        "/oauth-google",
        passport.authenticate("google", {
            scope: ["profile", "email"],
            prompt: "select_account",
        })
    )
    .get(
        "/oauth-callback",
        passport.authenticate("google", {
            failureRedirect: "/login",
            session: false,
        }),
        async (req, res) => {
            const payload = { id: req.user._id }
            const token = jwt.sign(payload, process.env.JWT_SECRET)

            res.redirect(
                `${process.env.SITE_URL}main?token=${token}&userId=${req.user._id}`
            )
        }
    )
export default loginRoute
