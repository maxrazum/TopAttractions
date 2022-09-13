const express = require('express');
const router = express.Router();

const Attraction = require('../models/attraction');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { attractionSchema } = require('../schemas');

const { isLoggedIn } = require('../middleware');


const validateAttraction = (req, res, next) => {
    const { error } = attractionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res, next) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index', { attractions })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('attractions/new')
});

router.post('/', isLoggedIn, validateAttraction, catchAsync(async (req, res, next) => {
    const attraction = new Attraction(req.body.attraction);
    attraction.author = req.user._id;
    await attraction.save();
    req.flash('success', 'Successfully made a New Attraction');
    res.redirect(`/attractions/${attraction._id}`)
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const attraction = await Attraction.findById(req.params.id).populate('reviews').populate('author');
    if (!attraction) {
        req.flash('error', 'Cannot find that Attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/show', { attraction })
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const attraction = await Attraction.findById(req.params.id)
    if (!attraction) {
        req.flash('error', 'Cannot find that Attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/edit', { attraction })
}));

router.put('/:id', isLoggedIn, validateAttraction, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const attraction = await Attraction.findByIdAndUpdate(id, { ...req.body.attraction });
    req.flash('success', 'Successfully apdated Attraction');
    res.redirect(`/attractions/${attraction._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Attraction.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Attraction');
    res.redirect('/attractions')
}));

module.exports = router;