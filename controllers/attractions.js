const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require("../cloudinary");

const Attraction = require('../models/attraction');


// module.exports.index = async (req, res, next) => {
//     const attractions = await Attraction.find({});
//     res.render('attractions/index', { attractions })
// }

module.exports.index = async (req, res, next) => {
    const attractions = await Attraction.paginate(
        {},
        {
            page: req.query.page || 1,
            limit: 10,
            sort: "-_id",
        }
    );
    attractions.page = Number(attractions.page);
    let totalPages = attractions.totalPages;
    let currentPage = attractions.page;
    let startPage;
    let endPage;

    if (totalPages <= 10) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }
    res.render('attractions/index', {
        attractions,
        startPage,
        endPage,
        currentPage,
        totalPages
        });
}

module.exports.renderNewForm = (req, res) => {
    res.render('attractions/new')
}

module.exports.createAttraction = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.attraction.location,
        limit: 1
    }).send()
    const attraction = new Attraction(req.body.attraction);
    attraction.geometry = geoData.body.features[0].geometry;
    attraction.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    attraction.author = req.user._id;
    await attraction.save();
    req.flash('success', 'Successfully made a New Attraction');
    res.redirect(`/attractions/${attraction._id}`)
}

module.exports.showAttraction = async (req, res, next) => {
    const attraction = await Attraction.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!attraction) {
        req.flash('error', 'Cannot find that Attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/show', { attraction })
}

module.exports.renderEditForm = async (req, res, next) => {
    const attraction = await Attraction.findById(req.params.id)
    if (!attraction) {
        req.flash('error', 'Cannot find that Attraction');
        return res.redirect('/attractions');
    }
    res.render('attractions/edit', { attraction })
}

module.exports.updateAttraction = async (req, res, next) => {
    const { id } = req.params;
    const attraction = await Attraction.findByIdAndUpdate(id, { ...req.body.attraction });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    attraction.images.push(...imgs);
    await attraction.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await attraction.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Attraction');
    res.redirect(`/attractions/${attraction._id}`)
}

module.exports.destroyAttraction = async (req, res, next) => {
    const { id } = req.params;
    await Attraction.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Attraction');
    res.redirect('/attractions')
}