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
            //YOUR USER ID
            author: '632a2f6366f9c88e14c13263',
            location: `${cities[i].city}`,
            title: `${cities[i].title}`,
            // image: `${cities[i].image}`,
            description: `${cities[i].description}`,
            price,
            geometry: {
                type: "Point",
                // Set default city to Toronto
                coordinates: [
                    cities[i].longitude,
                    cities[i].latitude,
                ]
            },
            images: [
                {
                    url: `${cities[i].url}`,
                    filename: `${cities[i].filename}`,
                }
            ]
        })
        await place.save();
    }
};

seedDB().then(() => db.close());