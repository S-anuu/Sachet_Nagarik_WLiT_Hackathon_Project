var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer'); // Import multer

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var petitionsRouter = require('./routes/petitions');
var complaintsRouter = require('./routes/complaints');
var queriesRouter = require('./routes/queries');

var app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
}).then(() => {
  console.log("Connected to db");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Passport configuration
require('./config/passport');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/petitions/add', upload.single('image'));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads folder

app.use('/', indexRouter);
app.use('/queries', queriesRouter);
app.use('/petitions', petitionsRouter);
app.use('/complaints', complaintsRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/`);
});

module.exports = app;
