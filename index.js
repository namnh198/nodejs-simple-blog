// Load modules
const express    = require('express');
const dotenv     = require('dotenv');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const flash      = require('connect-flash');
const session    = require('express-session');

// Routes
const indexRouter   = require('./routes/index');
const postRouter    = require('./routes/post');

// Setup the environment
dotenv.config();

// PORT
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

// Connected database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

// Create app
const app = express();

// Configuration ejs
app.set('view engine', 'ejs');

// Setup static file
app.use(express.static('public'))

// middewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
}))
app.use(flash());

// Setup passport
require('./config/passport')(app);

// Custom middwares
app.use((req, res, next) => {
	res.locals.currentUser = req.user; 
	res.locals.error = req.flash('error'); 
	res.locals.success = req.flash('success'); 
	next();
});

// Setup router
app.use('/', indexRouter);
app.use('/post', postRouter);

// Run server
app.listen(PORT, HOST);