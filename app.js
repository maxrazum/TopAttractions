const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Attraction= require('./models/attraction');

mongoose.connect('mongodb://localhost:27017/TopAttractions');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/attractions', async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index', {attractions})
});

app.get('/attractions/new', (req, res) => {
    res.render('attractions/new')
});

app.post('/attractions', async (req, res) => {
    const attraction = new Attraction(req.body.attraction);
    await attraction.save();
    res.redirect(`/attractions/${attraction._id}`)
});

app.get('/attractions/:id', async (req, res) => {
    const attraction = await Attraction.findById(req.params.id)
    res.render('attractions/show', {attraction});
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});