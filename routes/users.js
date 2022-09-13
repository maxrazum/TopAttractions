const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to TopAttractions');
            res.redirect('/attractions');
        })
    } catch (err) {
        req.flash('error, err.message');
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/attractions';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', async (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye');
        res.redirect('/attractions');
    });
});

module.exports = router;