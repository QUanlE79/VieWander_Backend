import mongoose from 'mongoose';
const { Schema } = mongoose;

const Landmark = new Schema({
    province_id: {
        type: String,
        required: true
    },
    name: {type: String,              
        required: true, 
    },
    type: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    funfact: {
        type: String
    },
    images: {
        type: [String]
    },
    rating: {
        type: Number
    }
});
let landmarkModel = mongoose.model('landmarks', Landmark,"landmarks");
export default landmarkModel