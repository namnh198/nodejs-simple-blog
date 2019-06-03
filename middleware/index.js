const Post = require('../models/Post');

exports.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		next();
	}
	else {
		req.flash('error', 'You must be logged in');
		res.redirect('/login');
	}
}

exports.isOwnerPost = async (req, res, next) => {
	if(req.isAuthenticated()) {
		try {
			// find post by id
			const post = await Post.findById(req.params.id);

			if(!post) {
				// if post not found
				req.flash('error', "404 not found");
				return res.redirect('back');
			}
			else {
				if(post.author.id.equals(req.user._id)) {
					next();
				}
				else {
					req.flash('error', 'You don\'t have permission ');
					return res.redirect('back');
				}
			}
		}
		catch(e) {
			req.flash('error', 'Something went wrong');
			res.redirect('back');
		}
	}
	else {
		req.flash('error', 'You must be logged in');
		res.redirect('/login');
	}
}