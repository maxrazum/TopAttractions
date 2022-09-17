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
            //YOUR USER ID
            author: '631f70ca562a88150066c8f8',
            location: `${cities[i].city}`,
            title: `${cities[i].title}`,
            // image: `${cities[i].image}`,
            description: 'North America is filled with must see attractions. Hundreds of locations draw millions of tourists to natural landmarks, historic sites and exciting places. Some are old, some are new. Some are geological wonders. Some are manmade structures.',
            price,
            geometry: {
                type: "Point",
                // Set default city to Toronto
                coordinates: [-79.3832, 43.6532]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxn4egwyq/image/upload/v1663372685/TopAttractions/1_5_yiffzg.jpg',
                    filename: 'TopAttractions/1_5_yiffzg',
                }, {
                    url: 'https://res.cloudinary.com/dxn4egwyq/image/upload/v1663372686/TopAttractions/1_3_provas.jpg',
                    filename: 'TopAttractions/1_3_provas',

                }
            ]
        })
        await place.save();
    }
};

seedDB().then(() => db.close());