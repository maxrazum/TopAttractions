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
        const price = Math.floor(Math.random() * 10) + 10;
        const place = new Attraction({
            location: `${cities[i].city}`,
            title: `${cities[i].title}`,
            image: `${cities[i].image}`,
            description: 'North America is filled with must see attractions. Hundreds of locations draw millions of tourists to natural landmarks, historic sites and exciting places. Some are old, some are new. Some are geological wonders. Some are manmade structures.',
            price
        })
        await place.save();
    }
};

seedDB().then(() => db.close());