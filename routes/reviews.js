const express = require('express');
const router = express.Router({ mergeParams: true });

const Attraction = require('../models/attraction');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/attractions/${id}`);
}));

module.exports = router;