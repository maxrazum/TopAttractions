const mongoose = require('mongoose');
const cities = require('./cities');
const Attraction = require('../models/attraction');

mongoose.connect('mongodb://localhost:27017/TopAttractions');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Attraction.deleteMany({});
    for (let i = 0; i < cities.length; i++) {
        const place = new Attraction({
            location: `${cities[i].city}`,
            title: `${cities[i].title}`
        })
        await place.save();
    }
};

seedDB().then(() => db.close());