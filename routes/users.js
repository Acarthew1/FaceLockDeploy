const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
//const TrustedUser = require('../models/TrustedUser');

//register
router.post('/register', (req, res, next) =>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
	    TrustedUsers: req.body.TrustedUsers
    });

    User.addUser(newUser, (err, user) =>{
        if(err){
            res.json({success: false, msg: 'Failed to register user'});
        } else{
            res.json({success: true, msg: 'User Registered'});
        }
    });

});

//Authenticate
router.post('/authenticate', (req, res, next) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});

        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 //1week

                });

                res.json({
                    success: true,
                    token: 'Bearer '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        unlocks: user.unlocks,
                        lastTime: user.lastTime,
                        totalUnrec: user.totalUnrec,
                        logs: user.logs

                    }
                });
            }else {
                return res.json({ success: false, msg: 'Wrong password'});
            }

        });
    })

});

//Profile
router.get('/profile', passport.authenticate('jwt',{session:false} ), (req, res, next) =>{
    res.json({user: req.user});

});

//Add TrustedUser
router.post('/trusted', (req, res, next) =>{
    //console.log("hello");
    const username = req.body.username;
    const TrustedUser = req.body.TrustedUser;

    User.addTrustedUser(username, TrustedUser, (err) =>{
        if(err){
            res.json({success: false, msg: 'Failed to add trusted user'});
        } else{
            res.json({success: true, msg: 'Trusted user Registered'});
        }

    });


});

//Add TrustedUser
router.post('/remtrusted', (req, res, next) =>{
    //console.log("hello");
    const username = req.body.username;
    const TrustedUser = req.body.TrustedUser;

    User.removeTrustedUser(username, TrustedUser, (err) =>{
        if(err){
            res.json({success: false, msg: 'Failed to remove trusted user'});
        } else{
            res.json({success: true, msg: 'Trusted user removed'});
        }

    });


});

module.exports = router;