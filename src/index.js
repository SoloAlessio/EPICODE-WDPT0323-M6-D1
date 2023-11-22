import express from 'express'
import {mongoose} from 'mongoose'
import apiRouter from './apiRouter.js';

const server = express()
const port = 3030;

server.use("/api", apiRouter)

mongoose
  .connect(
    "mongodb+srv://belcastroalessio:vPv7DcDu9-wa%23K9@epicode-wdpt0323.nrpo7is.mongodb.net/epicode"
  )
  .then(() => {
    server.listen(port, () => {
      console.log("🚀 Server listening to port: " + port);
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB");
  });