import express from "express";
import { Authors } from "./models/authors.js";

const authorsRouter = express.Router();

authorsRouter

    .get("/", async (req, res, next) => { /* GET ALL AUTHORS WITH QUERIES */
      try {
        const {limit, skip, sortBy, order} = req.query;
        const authors = await Authors.find({
          // price: { $gte: 300 },
          // $and: [{ price: { $gte: 100 } }, { price: { $lte: 110 } }],
        })
        .sort(
          sortBy && order ? {
            [sortBy]: order,
          } : undefined)
        .skip(skip)
        .limit(limit)

        res.json(authors);
      } catch (error) {
        next(error)
      }
      
    })

    .get("/:id", async (req, res) => { /* GET SPECIFIED AUTHOR */
      const author = await Authors.findById(req.params.id);

      if (!author) {
        return res.status(404).send();
      }

      res.json(author);
    })

    .post("/", async (req, res, next) => { /* POST NEW AUTHOR */
      try {
        const newUser = new Authors(req.body); 
        await newUser.save();

        res.status(201).send(newUser);
      } catch (error) {
        next(error)
      }
    })
    
    .delete("/:id", async (req, res, next) => { /* DELETE SPECIFIED AUTHOR */
      try {
        const deletedAuthors = await Authors.findByIdAndDelete(req.params.id);
        res.status(!deletedAuthors ? 404 : 200).send()
      } catch (error) {
        next(error)
      }

    })

    .put("/:id", async (req, res, next) => { /* UPDATE SPECIFIED AUTHOR */
      try {
        const updatedAuthor = await Authors.findByIdAndUpdate(
          req.params.id, 
          req.body, 
          {new: true},
        )
        res.json(updatedAuthor);
      } catch (error) {
        next(error)
      }
    })

export default authorsRouter;
