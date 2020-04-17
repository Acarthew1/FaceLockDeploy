const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    TrustedUsers: {
        type: Array,
        require: false
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);

}
module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);

}

module.exports.addTrustedUser = function(username, TrustedUsers, callback){
    //console.log("here");
    const query = {username: username};
    const newValue = TrustedUsers;
    User.findOneAndUpdate(query, {$push: {TrustedUsers: newValue}}, function(err, res){
        if(err != null){
            console.error("an error has occurred", err);
            callback(null, JSON.stringify(err));
        }
        else{
            console.log("Successfully added trusted user");
            callback(null, JSON.stringify("worked"));
        }
    }); 

   
    
}
module.exports.removeTrustedUser = function(username, TrustedUsers, callback){
    //console.log("here");
    const query = {username: username};
    const newValue = TrustedUsers;
    User.findOneAndUpdate(query, {$pull: {TrustedUsers: newValue}}, function(err, res){
        if(err != null){
            console.error("an error has occurred", err);
            callback(null, JSON.stringify(err));
        }
        else{
            console.log("Successfully added trusted user");
            callback(null, JSON.stringify("worked"));
        }
    });
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);

        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);

    });

}


