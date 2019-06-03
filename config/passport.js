const passport      = require('passport');
const localStrategy = require('passport-local').Strategy;
const User          = require('../models/User');

module.exports = function(app) {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => { done(null, user.id) });

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => { 
			done(err, user);
		});
	});

	passport.use('local-login', new localStrategy(function(username, password, done) {
		User.findOne({ username }, (err, user) => {
			if(err) {
				return done(err);
			}
			if(!user) {
				return done(null, false, { message: 'User not found' });
			}

			user.comparePassword(password, (err, isMatch) => {
                if (err) {
                	return done(null, false, { message: 'Something went wrong' });
                }
                if (!isMatch) {
                	return done(null, false, { message: 'Invalid password' });
                }

                return done(null, user)
            });
		});
	}));

	passport.use('local-register', new localStrategy( function(username, password, done) {
		User.findOne( { username }, async (err, user) => {
			if(err) {
				return done(err);
			}
			if(user) {
				return done(null, false, { message: 'Usename was used'});
			} 
			else {
				const newUser = new User ({ username, password });
				await newUser.save();
				return done(null, user);
			}
		});
	}));
}