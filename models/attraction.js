const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

// https://res.cloudinary.com/dxn4egwyq/image/upload/v1663350102/TopAttractions/mlewu4qx9z89m8uoavzv.jpg

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_160,h_90');
});

ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload', '/upload/ar_16:9,c_crop');
});

const AttractionSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

AttractionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Attraction', AttractionSchema);