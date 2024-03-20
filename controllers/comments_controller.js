const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function (req, res, next) {
  try {
    const post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();
      req.flash("success", "comment added");

      comment = await comment.populate({
        path: 'user',
        select: 'name email'
        });
        // commentsMailer.newComment(comment);
        //Below code is used for parallel jobs, here is a job being create using Kue library and it is being pushed in the priority queue to be processed by a worker.
        const job = queue.create('emails', comment).save((err)=>{
          if(err){
            console.log("Error in adding job in queue", err)
          }
            console.log("Job succesfully added to the queue",job.id)
          
        })
        // console.log(job.id);

      if (req.xhr) {
        // console.log("XHR call");
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment Created",
        });
      }

      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.destroy = function (req, res) {
  Comment.findById(req.params.id)
    .populate("post")
    .then((comment) => {
      if (comment.user == req.user.id || comment.post.user == req.user.id) {
        let postId = comment.post;
        comment
          .deleteOne()
          .then(() => {
            return Post.findByIdAndUpdate(postId, {
              $pull: { comments: req.params.id },
            })
              .then(() => {
                req.flash("success", "Comment Removed");
                return res.redirect("/");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      res.redirect("/");
    });
};
