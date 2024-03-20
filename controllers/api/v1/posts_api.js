const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
// this will be basically just like posts controller

module.exports.index = async function(req,res){
    // console.log(req.user)
    const posts = await Post.find({})
   .sort('-createdAt')
   .populate('user')
   .populate({
    path:'comments',
    populate:{
        path: 'user'
    }
   }) 
    return res.status(200).json({
        message : 'List of Posts in V1',
        posts : posts
    })
}

module.exports.destroy = function(req,res){
    Post.findById(req.params.id)
    .then((post)=>{
      if(post){
        if(post.user==req.user.id){
          post.deleteOne()
          .then(()=>{
            return Comment.deleteMany({post:req.params.id})
            .then(()=>{
             return res.status(200).json({
                message : "post deleted successfully"
             })
            //   req.flash('success', "Post and associated comments deleted")
            //   res.redirect("/");
            })
          })
          
        }else{
          return res.status(401).json({
            message : "You cannot delete this post"
         })
        }
      }
    //   }else{
        // res.redirect("/");
    //   }
    }).catch((err)=>{
    //   console.log(err)
    return res.status(500).json({
        message : "Internal Server Error"
    })
    })
  }