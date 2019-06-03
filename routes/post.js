const router                      = require('express').Router();
const { isLoggedIn, isOwnerPost } = require('../middleware');
const Post                        = require('../models/Post');

// Show the post page
router.get('/new', isLoggedIn, (req, res) => {
	res.render('newpost');
});

router.post('/new', isLoggedIn, async (req, res) => {
	const { title, image, content } = req.body;

	try {
		await( 
			new Post({
				title,
				image,
				content,
				author: {
					id: req.user._id,
					username: req.user.username,
				}
			})
			.save()
		);
		req.flash('success', 'Create new post success');
		res.redirect('/');	
	}
	catch(e) {
		res.render('newpost', { error: "Something went wrong" });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.render('showpost', { post: post });
	}
	catch(e) {
		req.flash('error', "404 not found");
		res.redirect('back');
	}
});

router.get('/:id/edit', isOwnerPost, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.render('editpost', { post: post });
	}
	catch(e) {
		req.flash('error', "404 not found");
		res.redirect('back');
	}
});

router.post('/:id/edit', isOwnerPost, async (req, res) => {
	const { title, image, content} = req.body;
	try {
		const post = await Post.findById(req.params.id);
		post.title   = title;
		post.image   = image;
		post.content = content;
		await post.save();
		req.flash('Update post success');
		return res.redirect(`/post/${post._id}`);
	}
	catch(e) {
		req.flash('error', 'Something went wrong');
		res.redirect('back');
	}
});

router.post('/:id/delete', isOwnerPost, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.delete();
		req.flash('success', 'Delete post success')
		return res.redirect('/');
	}
	catch(e) {
		req.flash('error', 'Something went wrong');
		res.redirect('back');
	}
});

// Export router
module.exports = router;