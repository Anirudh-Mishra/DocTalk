const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const rooms = []

// User model
const User = require('../models/User')
const Doctor = require('../models/Doctor');

// Home page
router.get('/home', (req, res) =>{
    res.render('home');
})

// Booking page
router.get('/booking', (req, res) =>{
    res.render('booking');
})

// Register page
router.get('/register', (req, res) =>{
    res.render('register');
})

// Login page
router.get('/login', (req, res) =>{
    res.render('login');
})

// Doctor dashboard page
router.get('/dashdoc', (req, res) =>{
    res.render('dashdoc');
})

// Register handle
router.post('/register', (req, res) =>{

    if(req.body.name == 'doctor'){            // For Doctor Login
        const { fullname, username, dept, yoexp, pass, cpass, _ } = req.body;
        console.log(req.body)
        let errors = [];

        // Check required fields
        if(!fullname || !username || !dept || !yoexp || !pass || !cpass){
            errors.push({ msg: 'Please fill in all fields' });
        }

        // Check passwords match
        if(pass != cpass)
            errors.push({ msg: 'Passwords do not match' });
        
        
        // Check password length
        if(pass.length < 6)
            errors.push({ msg: 'Password should atleast be 6 characters long' });
        
        if(errors.length > 0){
            res.render('register',{
                errors,
                fullname,
                username,
                dept,
                yoexp
            })
        }
        else
            // Validation passed
            Doctor.findOne({ username : username })
                .then(doctor => {
                    if(doctor){  
                        // User exists
                        errors.push({ msg: 'Username already exists'});
                        res.render('register',{
                            errors,
                            fullname,
                            username,
                            dept,
                            yoexp
                        })
                    } else {
                        const newDoctor = new Doctor({
                            fullname,
                            username,
                            dept,
                            yoexp,
                            pass
                        });
                        
                        // Hash password
                        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newDoctor.pass, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed 
                            newDoctor.pass = hash;
                            // Save user
                            newDoctor.save()
                                .then(doctor => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                    }
                })
    }

    else if(req.body.name == 'patient'){      // For Patient Login
        const { fullname, username, age, pass, cpass, _ } = req.body;
        console.log(req.body)
        let errors = [];

        // Check required fields
        if(!fullname || !username || !age || !pass || !cpass){
            errors.push({ msg: 'Please fill in all fields' });
        }

        // Check passwords match
        if(pass != cpass)
            errors.push({ msg: 'Passwords do not match' });
        
        
        // Check password length
        if(pass.length < 6)
            errors.push({ msg: 'Password should atleast be 6 characters long' });
        
        if(errors.length > 0){
            res.render('register',{
                errors,
                fullname,
                username,
                age
            })
        }
        else
            // Validation passed
            User.findOne({ username : username })
                .then(user => {
                    if(user){  
                        // User exists
                        errors.push({ msg: 'Username already exists'});
                        res.render('register',{
                            errors,
                            fullname,
                            username,
                            age
                        })
                    } else {
                        const newUser = new User({
                            fullname,
                            username,
                            age,
                            pass
                        });

                        // Hash password
                        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.pass, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed 
                            newUser.pass = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                    }
                })
    }
})

// Login handle
router.post('/login', (req, res, next) => {
    name = req.body.username;
    if(req.body.name == 'patient')
        passport.authenticate('user-local', {
            successRedirect: '/users/booking',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);

    else{
        rooms.push(name);  // Pushing online doctors names into global variable
        doctoruser = [];
        doctornames = [];
        doctordept = [];
        doctoryoexp = [];
        var redirectsite = '';
        
        // Passing online doctor details into global variables to display in booking page
        rooms.forEach(doctor => {   
            let username = doctor;
            Doctor.findOne({ username : username })
                .then(doctor => {
                    doctoruser.push(username);
                    doctornames.push(doctor.fullname);
                    doctordept.push(doctor.dept);
                    doctoryoexp.push(doctor.yoexp);
                    console.log(doctornames,doctordept,doctoryoexp);
                }
            )});

            redirectsite = '/users/chatroom/'+name+'?name='+name;

        passport.authenticate('doctor-local', {
            successRedirect: redirectsite,
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    }
    console.log(rooms);
});


// Chat room window page
router.get('/chatroom', (req, res) =>{
    res.render('chatroom');
})

// Logout handle
router.get('/logout', (req, res, next) =>{
    index = rooms.indexOf(req.name);
    rooms.splice(index, 1);
    req.logout();
    console.log(req.name);
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/users/login');
})

module.exports = router;