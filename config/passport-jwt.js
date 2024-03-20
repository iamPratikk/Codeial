const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest : extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial'
};

passport.use(new jwtStrategy(opts,(payload,done)=>{
    console.log(payload);
    User.findById(payload._id)
    .then((user)=>{
        if(user){
            return done(null,user)
        }else{
            return done(null, false)
        }
    })
    
}));

module.exports = passport;
