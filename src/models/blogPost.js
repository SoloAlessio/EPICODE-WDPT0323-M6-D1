import { Schema, model } from 'mongoose';

const blogPostSchema = new Schema(
    {
        category: {
            type: String, 
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        cover: {
            type: String, 
            required: true
        },
        readtime: {
            value: {
                type: Number, 
                required: true
            },
            unit: {
                type: String, 
                required: true
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "Author",
            required: true
        },
        content: {
            type: String, 
            required: true
        },
        comments:[{
            "text": String,
            "author": {
                type: Schema.Types.ObjectId,
                ref: "Author"
            },
        }]
    }, 
    {collection: 'blogposts'}
)

export default model('BlogPost', blogPostSchema)