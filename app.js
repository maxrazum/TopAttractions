const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { attractionSchema } = require('./schema');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Attraction = require('./models/attraction');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/TopAttractions');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateAttraction = (req, res, next) => {
    const { error } = attractionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/attractions', catchAsync(async (req, res, next) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index', { attractions })
}));

app.get('/attractions/new', (req, res) => {
    res.render('attractions/new')
});

app.post('/attractions', validateAttraction, catchAsync(async (req, res, next) => {
    const attraction = new Attraction(req.body.attraction);
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`)
}));

app.get('/attractions/:id', catchAsync(async (req, res, next) => {
    const attraction = await Attraction.findById(req.params.id)
    res.render('attractions/show', { attraction })
}));

app.get('/attractions/:id/edit', catchAsync(async (req, res, next) => {
    const attraction = await Attraction.findById(req.params.id)
    res.render('attractions/edit', { attraction })
}));

app.put('/attractions/:id', validateAttraction, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const attraction = await Attraction.findByIdAndUpdate(id, { ...req.body.attraction });
    res.redirect(`/attractions/${attraction._id}`)
}));

app.delete('/attractions/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Attraction.findByIdAndDelete(id);
    res.redirect('/attractions')
}));

app.post('/attractions/:id/reviews', catchAsync(async (req, res) => {
    const attraction = await Attraction.findById(req.params.id);
    const review = new Review(req.body.review);
    attraction.reviews.push(review);
    await review.save();
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});