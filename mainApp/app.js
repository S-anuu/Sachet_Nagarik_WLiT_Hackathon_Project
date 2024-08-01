var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var petitionsRouter = require('./routes/petitions')
var complaintsRouter = require('./routes/complaints')
var queriesRouter = require('./routes/queries')

var app = express();

mongoose.connect('mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(( )=> {
  console.log("Connected to db")
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 
		
// parse application/json
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/queries', queriesRouter);
app.use('/petitions', petitionsRouter )
app.use('/complaints', complaintsRouter )

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
  console.log(`Server started at http://localhost:${PORT}/`)
})

module.exports = app;
