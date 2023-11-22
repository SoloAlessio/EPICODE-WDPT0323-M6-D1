import express from "express";
import { Authors } from "./models/authors.js";

const authorsRouter = express.Router();

/* TESTING */
authorsRouter.get("/test", async (req, res) => {
  res.json({ message: "Users router working!" });
});

/* GET LIST OF AUTHORS */
authorsRouter.get("/", async (req, res) => {
  const users = await Authors.find({});
  res.json(users);
});

/* GET SPECIFIED AUTHOR */
authorsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Authors.findById(id);

  if (!user) {
    return res.status(404).send();
  }

  res.json(user);
});


/* CREATE NEW AUTHOR */
authorsRouter.post("/", async (req, res) => {
  const newUser = new Authors(req.body);
  
  await newUser.save();

  res.status(201).send(newUser);
});


/* DELETE SPECIFIED AUTHOR */
authorsRouter.delete("/authors/:id", async (req, res) => {
    const {id} = req.params;
    const user = await Authors.findById(id)

    if(!user){
        return res.status(404).send()
    }

    await Authors.findByIdAndDelete(id)
    res.json({message: 'Deleted Successfully'})
})

export default authorsRouter;
