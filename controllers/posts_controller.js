const Post = require("../models/post");
const Comment = require("../models/comment");


module.exports.create= function(req,res,next){
  Post.create({
    content:req.body.content,
    user: req.user._id
  })
  .then((post)=>{
    if(post){
      console.log("Post saved***********", post)
      if(req.xhr){
        return res.status(200).json({
          data : {
            Post : post,
            UserName : req.user.name
          },
          message : "Post Created"
        });
      }
      req.flash('success',"Post saved" );
        
        return res.redirect('back');
    }
  }).catch((err)=>{
    req.flash('error', "error saving the post in db")
    console.log(err, "error saving the post in db")
    return res.redirect('back');
  })
   
}

module.exports.home= function(req,res){
    return res.end('<h1>home page which shows all the posts</h1>');
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
            if(req.xhr){
              console.log("Inside XHR")
              return res.status(200).json({
                data:{
                  post_id: req.params.id,

                },
                message : "post deleted successfully"
              })
            }
            req.flash('success', "Post and associated comments deleted")
            res.redirect("/");
          })
        })
        
      }
    }else{
      res.redirect("/");
    }
  }).catch((err)=>{
    console.log(err)
  })
}