import express from "express"
import authorsRoute from "./authorsRoute.js"
import blogPostRoute from "./blogPostRoute.js"

const apiRoute = express.Router()

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
        <div class="container">
          <div class="row g-4">
            <div class="col-6 mx-auto text-center py-3">
              <h4 class="text-primary">Test Rendering: Success!</h4>
              <p class="text-secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu egestas nibh. Nam ac vehicula orci, a varius nisi. Aenean et ligula non purus fringilla viverra at et ligula. Nam a justo odio. Morbi sit amet dictum nulla. Nunc rhoncus quis purus sit amet fermentum. Vestibulum id venenatis mauris, non vestibulum leo.<br>
                Donec eget urna tellus.</p>
            </div>
        </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </body>
    </html>
    `)
})

apiRoute.get("/test", (req, res) => {
    res.json({ message: "Hello, World!" })
})

apiRoute.use("/authors", authorsRoute)
apiRoute.use("/blogs", blogPostRoute)

export default apiRoute
