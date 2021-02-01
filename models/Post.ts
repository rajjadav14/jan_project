import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    Likes: [
        {
            users: {
                type:Schema.Types.ObjectId,
                ref:'users'
            }
        }

    ],
    Comments:[
        {
            users: {
                type:Schema.Types.ObjectId,
                ref:'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ]
});

export const postModel =  mongoose.model('post',PostSchema);