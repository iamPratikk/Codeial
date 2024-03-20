const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy ({
    usernameField: 'email',
    passReqToCallback: true
},(req,email,password,done)=>{
    //this email,password is the password passed by the browser(sign in page)
// here we are authenticating our user
//just like manual auth, we check if credentials matches off the db
try{
    User.findOne({email:email})
    .then((user)=>{
        if(!user || user.password != password){
            req.flash('error', 'Invalid User/Password');
            return done(null,false);
        }
        return done(null, user);
       
    }) 
}catch(err){
 req.flash('error', "Cant find user in DB");
return done(err,false);
}

}));

//when the user is authenticated then we need to tell passport to save the user id into session cookie
//This is called serialization
passport.serializeUser((user,done)=>{
    done(null, user.id);
})

//when browser sends request to server then it needs to decrypt the userId and check it in db
//This process is called deSerialization
passport.deserializeUser((id, done)=>{
    User.findById(id)
    .then((user)=>{
        if(user){
            return done(null,user);
        }
    }).catch((err)=>{
        console.log("Cant find user in DB");
        return done(err);
    })
});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in')
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current authenticated user and we are sending it to the locals for view
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;