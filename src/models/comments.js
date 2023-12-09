import { Schema, model } from "mongoose"

const commentsSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "Author",
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "BlogPost",
        },
    },
    { collection: "comments" }
)

export default model("Comment", commentsSchema)
