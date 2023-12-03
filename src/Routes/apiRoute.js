import express from "express";
import authorsRoute from "./authorsRoute.js";
import blogPostRoute from "./blogPostRoute.js";

const apiRoute = express.Router();

apiRoute.use(express.json())

apiRoute.get("/", (req, res) => {
res.status(200).send(/*html*/ `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bootstrap demo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      </head>
      <body>
        <h1>Hello, world!</h1>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </body>
    </html>
    `);
})

apiRoute.get("/test", (req, res) => {
    res.json({message: "Hello, World!"})
})

apiRoute.use("/authors", authorsRoute);
apiRoute.use("/blogs", blogPostRoute); 

export default apiRoute;