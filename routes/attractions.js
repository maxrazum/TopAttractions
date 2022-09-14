const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateAttraction } = require('../middleware');

const attractions = require('../controllers/attractions');


router.get('/', catchAsync(attractions.index));

router.get('/new', isLoggedIn, attractions.renderNewForm);

router.post('/', isLoggedIn, validateAttraction, catchAsync(attractions.createAttraction));

router.get('/:id', catchAsync(attractions.showAttraction));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(attractions.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateAttraction, catchAsync(attractions.updateAttraction));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(attractions.destroyAttraction));

module.exports = router;