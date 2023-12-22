import express from "express"
import BlogPost from "../models/blogPost.js"
import Comment from "../models/comments.js"
import { checkAuth } from "../middlewares/authControl.js"
import path from "path"
import q2m from "query-to-mongo"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import sgMail from "@sendgrid/mail"

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "EPICODE-STORAGE",
    },
})

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Storage = multer({ storage: cloudinaryStorage })

const blogPostRoute = express.Router()

blogPostRoute

    .get("/", async (req, res, next) => {
        /* GET ALL BLOGS */
        try {
            let { criteria } = q2m(req.query)
            let blogs = await BlogPost.find(criteria).populate(
                "comments author"
            )

            res.send(blogs)
        } catch (error) {
            next(error)
        }
    })

    .get("/:id", async (req, res, next) => {
        /* GET A SPEC BLOG */
        try {
            let blog = await BlogPost.findById(req.params.id).populate("author")
            res.send(blog)
        } catch (error) {
            next(error)
        }
    })

    .get("/:id/comments", async (req, res, next) => {
        /* GET A SPEC BLOG COMMENT SECTION */
        try {
            let comments = await Comment.find({
                post: req.params.id,
            }).populate({
                path: "author",
                model: "Author",
                select: ["name", "surname", "avatar"],
            })

            res.send(comments)
        } catch (error) {
            next(error)
        }
    })

    .get("/:id/comments/:commentId", async (req, res, next) => {
        /* GET A SPEC COMMENT */
        try {
            let comments = await Comment.find({
                post: req.params.id,
                _id: req.params.commentId,
            }).populate({
                path: "author",
                model: "Author",
                select: ["name", "surname", "avatar"],
            })
            res.send(comments)
        } catch (error) {
            next(error)
        }
    })

    .post("/", checkAuth, async (req, res, next) => {
        /* POST A NEW BLOG */
        try {
            const NewBlogPost = await BlogPost.create(req.body)
            const createdPost = await BlogPost.findById(
                NewBlogPost._id
            ).populate("author")
            const mail = await createdPost.author.email

            if (mail) {
                const msg = {
                    to: mail,
                    from: "Sender.Example@outlook.it",
                    subject: "TESTING MAIL",
                    text: "This is a testing mail foìron a radon oerso",
                    html: "<strong>TEsstin mail</strong>",
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log("Email sent", mail)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }

            res.send(NewBlogPost)
        } catch (error) {
            next(error)
        }
    })

    .post("/:id", checkAuth, async (req, res, next) => {
        /* POST A NEW COMMENT ON A SPEC BLOG */
        try {
            let newComment = await Comment.create({
                ...req.body,
                post: req.params.id,
            })

            let post = await BlogPost.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        comments: newComment,
                    },
                },
                { new: true }
            ).populate({
                path: "comments",
                populate: {
                    path: "author",
                    model: "Author",
                    select: ["name", "lastName", "avatar"],
                },
            })
            res.send(post)
        } catch (error) {
            next(error)
        }
    })

    .delete("/:id", checkAuth, async (req, res, next) => {
        /* DELETE A SPEC BLOG */
        try {
            await BlogPost.deleteOne({
                _id: req.params.id,
            })
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    })

    .delete("/:id/comments/:commentId", checkAuth, async (req, res, next) => {
        /* DELETE A SPEC COMMENT */
        try {
            await Comment.findOneAndDelete({
                post: req.params.id,
                _id: req.params.commentId,
            })
            res.send(204)
        } catch (error) {
            next(error)
        }
    })

    .put("/:id", checkAuth, async (req, res, next) => {
        /* UPDATE A SPEC BLOG */
        try {
            const updateBlogPost = await BlogPost.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
            res.json(updateBlogPost)
        } catch (error) {
            next(error)
        }
    })

    .put("/:id/comments/:commentId", checkAuth, async (req, res, next) => {
        /* UPDATE A SPEC COMMENT */
        try {
            let comment = await Comment.findOneAndUpdate(
                {
                    post: req.params.id,
                    _id: req.params.commentId,
                },
                req.body,
                { new: true }
            ).populate({
                path: "author",
                model: "Author",
                select: ["name", "surname", "avatar"],
            })

            res.send(comment)
        } catch (error) {
            next(error)
        }
    })

    .patch("/:id/cover", Storage.single("cover"), async (req, res, next) => {
        /* PUT A NEW COVER FOR A SPEC. BLOGPOST */
        try {
            const user = await BlogPost.findByIdAndUpdate(
                req.params.id,
                {
                    cover: req.file.path,
                },
                { new: true }
            )
            res.send(user)
        } catch (error) {
            next(error)
        }
    })

export default blogPostRoute
