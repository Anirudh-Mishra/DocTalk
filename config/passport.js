const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');
const Doctor = require('../models/Doctor');

module.exports = function(passport){
    passport.use('user-local',
        new LocalStrategy({ usernameField : 'username', passwordField : 'pass' }, (username, pass, done) => {
            // Match user
            User.findOne({ username : username })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message : 'Username does not exist' });
                    }

                    // Match password
                    bcrypt.compare(pass, user.pass, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message : 'Incorrect Password'})
                        }

                    })
                })

                .catch(err => console.log(err));
        }));

    passport.use('doctor-local',
        new LocalStrategy({ usernameField : 'username',passwordField : 'pass' }, (username, pass, done) => {
        // Match user
            Doctor.findOne({ username : username })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message : 'Username does not exist' });
                    }

                    // Match password
                    bcrypt.compare(pass, user.pass, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message : 'Incorrect Password'});
                        }

                    })
                })

                .catch(err => console.log(err))
            }));
    

    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
            return;
        });
    
        Doctor.findById(id, function(err, user) {
            done(err, user);
            return;
        });
    });
}