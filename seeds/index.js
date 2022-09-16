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
    for (let i = 0; i < 3; i++) {
        const price = Math.floor(Math.random() * 10) + 10;
        const place = new Attraction({
            author: '631f70ca562a88150066c8f8',
            location: `${cities[i].city}`,
            title: `${cities[i].title}`,
            // image: `${cities[i].image}`,
            description: 'North America is filled with must see attractions. Hundreds of locations draw millions of tourists to natural landmarks, historic sites and exciting places. Some are old, some are new. Some are geological wonders. Some are manmade structures.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dxn4egwyq/image/upload/v1663286846/TopAttractions/gklewb4arfn7cg0khpnx.jpg',
                    filename: 'TopAttractions/gklewb4arfn7cg0khpnx',
                }, {
                    url: 'https://res.cloudinary.com/dxn4egwyq/image/upload/v1663286848/TopAttractions/v0fupne75q5oseo2r4iw.jpg',
                    filename: 'TopAttractions/v0fupne75q5oseo2r4iw',

                }
            ]
        })
        await place.save();
    }
};

seedDB().then(() => db.close());