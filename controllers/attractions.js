const Attraction = require('../models/attraction');


module.exports.index = async (req, res, next) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index', { attractions })
}

module.exports.renderNewForm = (req, res) => {
    res.render('attractions/new')
}

module.exports.createAttraction = async (req, res, next) => {
    const attraction = new Attraction(req.body.attraction);
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
    req.flash('success', 'Successfully apdated Attraction');
    res.redirect(`/attractions/${attraction._id}`)
}

module.exports.destroyAttraction = async (req, res, next) => {
    const { id } = req.params;
    await Attraction.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Attraction');
    res.redirect('/attractions')
}