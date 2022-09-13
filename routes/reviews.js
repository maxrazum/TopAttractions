const express = require('express');
const router = express.Router({ mergeParams: true });

const Attraction = require('../models/attraction');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

const { validateReview, isLoggedIn } = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    req.flash('success', 'Created a new review');
    res.redirect(`/attractions/${attraction._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/attractions/${id}`);
}));

module.exports = router;