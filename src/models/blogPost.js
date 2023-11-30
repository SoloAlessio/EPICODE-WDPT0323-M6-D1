import mongoose, {Schema} from 'mongoose';

const blogPostSchema = new Schema({
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
        name: {
            type: String, 
            required: true
        }, 
        avatar: {
            type: String, 
            required: true
        },
    },
    content: {
        type: String, 
        required: true
    },

})

export const BlogPost = mongoose.model('blogposts', blogPostSchema)