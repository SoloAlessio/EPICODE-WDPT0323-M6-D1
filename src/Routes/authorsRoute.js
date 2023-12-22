import express from "express"
import Author from "../models/authors.js"
import blogPost from "../models/blogPost.js"
import path from "path"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const authorsRoute = express.Router()

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "EPICODE-STORAGE",
    },
})

const Storage = multer({ storage: cloudinaryStorage })

authorsRoute

    .get("/", async (req, res, next) => {
        /* GET ALL AUTHORS WITH QUERIES */
        try {
            const { limit, skip, sortBy, order } = req.query
            const authors = await Author.find({})
                .sort(
                    sortBy && order
                        ? {
                              [sortBy]: order,
                          }
                        : undefined
                )
                .skip(skip)
                .limit(limit)

            res.json(authors)
        } catch (error) {
            next(error)
        }
    })

    .get("/:id", async (req, res) => {
        /* GET SPECIFIED AUTHOR */
        const author = await Author.findById(req.params.id)

        if (!author) {
            return res.status(404).send()
        }

        res.json(author)
    })

    .get("/:id/blogs", async (req, res, next) => {
        /* GET SPECIFIED AUTHOR BLOGS */
        try {
            let author = await blogPost
                .find({
                    author: req.params.id,
                })
                .populate({
                    path: "author",
                    select: ["name", "surname", "avatar"],
                })

            res.send(author)
        } catch (error) {
            next(error)
        }
    })

    .post("/", async (req, res, next) => {
        /* POST NEW AUTHOR */
        const newUser = await Author.create(req.body)

        res.status(201).json(newUser)
    })

    .post("/login", async (req, res, next) => {
        const { email } = req.body
        const user = await Author.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const payload = { id: user._id }
        console.log(payload)
        const token = jwt.sign(payload, "SEGRETO", { expiresIn: "1h" })
        res.status(200).json({ token: token, userId: user._id })
    })

    .delete("/:id", async (req, res, next) => {
        /* DELETE SPECIFIED AUTHOR */
        try {
            const deletedAuthors = await Author.findByIdAndDelete(req.params.id)
            res.status(!deletedAuthors ? 404 : 200).send()
        } catch (error) {
            next(error)
        }
    })

    .put("/:id", async (req, res, next) => {
        /* UPDATE SPECIFIED AUTHOR */
        try {
            const updatedAuthor = await Author.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
            res.json(updatedAuthor)
        } catch (error) {
            next(error)
        }
    })

    .patch("/:id/avatar", Storage.single("avatar"), async (req, res, next) => {
        /* PUT A AVATAR IMAGE FOR A SPEC AUTHOR */
        try {
            const user = await Author.findByIdAndUpdate(
                req.params.id,
                {
                    avatar: req.file.path,
                },
                { new: true }
            )
            res.status(204).send({
                success: true,
                url: req.file.path,
                author: user,
            })
        } catch (error) {
            next(error)
        }
    })

export default authorsRoute
