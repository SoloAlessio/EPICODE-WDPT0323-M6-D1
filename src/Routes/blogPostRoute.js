import express from "express"
import BlogPost from "../models/blogPost.js"
import Comment from "../models/comments.js"
import { checkAuth } from "../middlewares/authControl.js"

const blogPostRoute = express.Router()

blogPostRoute

    .get("/", async (req, res, next) => {
        /* GET ALL BLOGS */
        try {
            const { limit, skip, sortBy, order } = req.query
            const BlogPosts = await BlogPost.find({})
                .sort(
                    sortBy && order
                        ? {
                              [sortBy]: order,
                          }
                        : undefined
                )
                .skip(skip)
                .limit(limit)
                .populate("author")

            res.json(BlogPosts)
        } catch (error) {
            next(error)
        }
    })

    .get("/:id", async (req, res, next) => {
        /* GET A SPEC BLOG */
        try {
            const SpecBlogPost = await BlogPost.findById(
                req.params.id
            ).populate("author")

            if (!SpecBlogPost) {
                return res.status(404).send()
            }

            res.json(SpecBlogPost)
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
            res.status(201).send(NewBlogPost)
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
            console.log(newComment)

            let post = await BlogPost.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        comments: newComment,
                    },
                },
                { new: true }
            )
            res.send(post)
        } catch (error) {
            next(error)
        }
    })

    .delete("/:id", checkAuth, async (req, res, next) => {
        /* DELETE A SPEC BLOG */
        try {
            const deletedBlogPost = await BlogPost.findByIdAndDelete(
                req.params.id
            )
            res.status(!deletedBlogPost ? 404 : 200).send()
        } catch (error) {
            next(error)
        }
    })

    .delete("/:id/comments/:commentId", checkAuth, async (req, res, next) => {
        /* DELETE A SPEC COMMENT */
        try {
            let comment = await Comment.findOneAndDelete({
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
            let updatedComment = await Comment.findOneAndUpdate(
                {
                    post: req.params.id,
                    _id: req.params.commentId,
                },
                req.body,
                { new: true }
            ).populate("author")

            res.send(updatedComment)
        } catch (error) {
            next(error)
        }
    })

export default blogPostRoute
