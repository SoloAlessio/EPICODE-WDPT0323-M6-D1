import express from "express"
import Author from "../models/authors.js"
import blogPost from "../models/blogPost.js"
import path from "path"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

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
        try {
            const newUser = new Author(req.body)
            await newUser.save()

            res.status(201).send(newUser)
        } catch (error) {
            next(error)
        }
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
