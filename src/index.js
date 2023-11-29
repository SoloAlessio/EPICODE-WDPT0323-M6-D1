import express from 'express'
import apiRouter from './apiRouter.js';
import mongoose from 'mongoose'
import list from "express-list-endpoints";
import { GenericError } from './middlewares/Error.js';

const server = express()
const port = 3030;

server.use("/api", apiRouter)

server.use(GenericError)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("🚀 Server listening to port: " + port);
      console.log(list(server));
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });