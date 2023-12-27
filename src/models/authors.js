import { Schema, model } from "mongoose"

const AuthorSchema = new Schema(
    {
        googleId: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function () {
                return this.googleId ? false : true
            },
        },
        birthDate: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
        },
    },
    { collection: "users" }
)

export default model("Author", AuthorSchema)
