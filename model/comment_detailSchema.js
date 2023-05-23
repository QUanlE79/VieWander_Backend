import mongoose from 'mongoose';
const { Schema } = mongoose;

const Comments = new Schema({
    landmark_id:{
        type:String,
        required: true
    },
    author_id: {
        type:String,
        required: true
    },
    content: {
        type: String
    },
    date_post:{
        type: Number
    },
    rating:{
        type: Number
    }
});
let CommentModel = mongoose.model('comments_detail', Comments,"comments_detail");
export default CommentModel