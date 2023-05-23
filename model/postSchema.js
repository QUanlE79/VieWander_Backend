import mongoose from 'mongoose';
const { Schema } = mongoose;

const Post = new Schema({
    author_id: {
        type: String,              
        required: true, 
    },
    content: {
        type: String
    },
    date_post:{
        type: Number,
        default: Date.now()
    },
    num_of_like:{
        type: Number
    },
    view_mode:{
        type: String
    }
});
let postModel = mongoose.model('posts', Post,"posts");
export default postModel