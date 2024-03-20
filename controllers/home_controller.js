const Post = require('../models/post');
const User = require('../models/user');
module.exports.home= async function(req,res){
   const posts = await Post.find({})
   .sort('-createdAt')
   .populate('user')
   .populate({
    path:'comments',
    populate:{
        path: 'user'
    }
   }) 
   .exec();
    let userList = await User.find({})
//    console.log(req.user)
    return res.render("home", {
        title: "Codeial Home",
        posts: posts,
        all_users: userList
    })
    
   
   
}

module.exports.create_post= function(req,res){
    console.log(req.body)
}