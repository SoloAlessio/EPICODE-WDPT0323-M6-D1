import { Schema, model } from 'mongoose';

const AuthorSchema = new Schema(
    {
        name: {
            type: String, 
            required: true
        },
        surname: {
            type: String, 
            required: true
        },
        email: {
            type: String, 
            required: true
        },
        birthDate: {
            type: String, 
            required: true
        },
        avatar: {
            type: String
        },
    }, 
    { collection: "users" }
)

export default model('Author', AuthorSchema)