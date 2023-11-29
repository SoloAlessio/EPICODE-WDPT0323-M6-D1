import express from "express";
import { BlogPost } from "./models/blogPost.js";

const blogPostRouter = express.Router();

blogPostRouter

    .get('/', async (req,res,next) => {
        try {
            const {limit, skip, sortBy, order} = req.query;
            const BlogPosts = await BlogPost.find({
              // price: { $gte: 300 },
              // $and: [{ price: { $gte: 100 } }, { price: { $lte: 110 } }],
            })
            .sort(
              sortBy && order ? {
                [sortBy]: order,
              } : undefined)
            .skip(skip)
            .limit(limit)
      
            res.json(BlogPosts);
          } catch (error) {
            next(error)
          }
    })

    .get('/:id', async (req,res,next) => {
        try {
            const SpecBlogPost = await BlogPost.findById(req.params.id);

            if(SpecBlogPost){
                res.status(404).send();
            }

            res.json(SpecBlogPost)
        } catch (error) {
            next(error)
        }
    })

    .post('/', async (req,res,next) => {
        try {
            const NewBlogPost = new BlogPost(req.body)
            await NewBlogPost.save();

            res.status(201).send(NewBlogPost);
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req,res,next) => {
        try {
            const deletedBlogPost = await BlogPost.findByIdAndDelete(rq.params.id)
            res.status(!deletedBlogPost ? 404 : 200).send()
        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req,res,next) => {
        try {
            const updateBlogPost = await BlogPost.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                {new: true},
            )
            res.json(updateBlogPost)
        } catch (error) {
            next(error)
        }
    })

export default blogPostRouter