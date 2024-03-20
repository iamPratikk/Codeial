const User = require("../models/user");

module.exports.profile = function (req, res) {
 if(req.cookies.user_id){
  User.findById(req.cookies.user_id)
  .then((user)=>{
    if(user){
      res.render("user_profile",{
        title:"user profile",
        user:user
      })
    }else{
      res.redirect("/users/sign-in")
      return;
    }
  }).catch((err)=>{
    console.log(err)
  })
 }else{
  res.redirect("/users/sign-in");
 }
};

module.exports.newProfile = function(req,res){
  User.findById(req.params.id)
  .then((user)=>{
    res.render("user_profile",{
      title:"user profile",
      profile_user: user
    });
  })
  
}

module.exports.home = function (req, res) {
  return res.end("<h1>user home page</h1>");
};

module.exports.sign_in = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile')
  }
  return res.render("user-sign-in", {
    title: "Codeial app",
  });
};

module.exports.sign_up = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile')
  }
  return res.render("user-sign-up", {
    title: "codeial App",
  });
};

module.exports.createUser = function (req, res) {
  // to-do now
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user)
      if (!user) {
        try {
          User.create(req.body);
          console.log("user created in db");
          res.redirect('/users/sign-in')
        } catch (err) {
          console.log("error while creating user in db", err);
          return;
        }
      }
      if (user) {
        console.log("user already present in db");
        res.redirect("back");
      }
    })
    .catch((err) => console.log("error in finding user in db", err));
};


module.exports.createSession = function (req, res) {
  //to-do later
  User.findOne({email: req.body.email})
  .then((user)=>{
    if(user){
      if(user.password==req.body.password){
        console.log("user Logged In", user);
        res.cookie("user_id", user.id)
        res.redirect("/users/profile");
        return;
      }else{
        console.log("Your password didnt match")
        res.redirect("back")
        return;
      }
    }else{
      console.log("Coudn't find the username")
      res.redirect("back");
      return;
    }

  }).catch((err)=>{
    console.log(err)
  })
};

module.exports.signOut= function(req,res){
  req.logout((err)=>{
    if(err){
      console.log("error while logging out");
      
    }
    req.flash("success", "You have been logged out");
    res.redirect("/")
  });
  
}

module.exports.createNewSession= function(req,res){
  req.flash("success", "logged in successfully");
  return res.redirect("/");
}

module.exports.update = async function(req,res){
  if(req.user.id == req.params.id){
    try{
      const user = await User.findByIdAndUpdate(req.params.id, req.body);
      User.uploadedAvatar(req,res,function(err){
        if(err){
          console.log('multer error*******',err)
        }
        user.name = req.body.name;
        user.email = req.body.email;

        console.log(req.file);
          console.log(User.avatarPath);

        if(req.file){
          
          //this is saving the path of the avatar image into the avatar field of the user model of DB
          user.avatar = User.avatarPath +'/'+ req.file.filename
        }
        user.save();
        res.redirect('back');
      })
    }catch(err){
      req.flash('error',err);
      res.redirect('back')
    }
   
    
  }else{
    req.flash('error','Unauthorized');
    return res.status(401).send('Unauthorized');
  }
}