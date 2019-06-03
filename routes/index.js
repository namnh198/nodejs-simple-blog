const router   = require('express').Router();
const User     = require('../models/User');
const Post     = require('../models/Post');
const passport = require('passport');

// Show the homepage
router.get('/', async (req, res) => {
	// find all post
	const posts = await Post.find().sort({ createdAt: -1}).exec();

	res.render('index', { posts: posts });
});

// Show the register page
router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', passport.authenticate('local-register', {
	successRedirect: '/',
	failureRedirect: '/register',
	failureFlash: true
}));

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged Out');
	res.redirect('/');
});

// Export router
module.exports = router;