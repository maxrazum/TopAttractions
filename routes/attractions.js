const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateAttraction } = require('../middleware');

const attractions = require('../controllers/attractions');


router.route('/')
    .get(catchAsync(attractions.index))
    .post(isLoggedIn, validateAttraction, catchAsync(attractions.createAttraction));

router.get('/new', isLoggedIn, attractions.renderNewForm);

router.route('/:id')
    .get(catchAsync(attractions.showAttraction))
    .put(isLoggedIn, isAuthor, validateAttraction, catchAsync(attractions.updateAttraction))
    .delete(isLoggedIn, isAuthor, catchAsync(attractions.destroyAttraction));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(attractions.renderEditForm));

module.exports = router;