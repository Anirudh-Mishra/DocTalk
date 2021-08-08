const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

const users = {};

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser : true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded ({ extended : false }))

// Express Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// CSS and JS file directory
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


// Chatroom functionalities
io.on('connection', socket => {
    socket.on('user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })
    
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name : users[socket.id] })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    })
})
    
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
server.listen(5100);