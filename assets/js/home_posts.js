{
    // This script file is responsible for preventing the usual flow of data transfer and sending the data to the particular controllers
    // console.log("Script loaded")
    //method to submit the form data to the post controller using AJAX
    
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit((e)=>{
            e.preventDefault();
            $.ajax({
                type : "post",
                url : "/posts/create",
                data : newPostForm.serialize(),
                success : (data)=>{
                    console.log(newPostForm);
                   let newPost = newPostDom(data.data.Post,data.data.UserName);
                   $('#posts-list-container>ul').prepend(newPost);
                   deletePost(" .delete-post-button" ,newPost);
                   newPostForm[0].reset();
                },
                error : (err)=>{
                    console.log(err)
                }
            });
        });
    }
    createPost();
   


    let createComment = function(){
        let newCommentForm = $('#post-comment');
        newCommentForm.submit((e)=>{
            e.preventDefault();
            $.ajax({
                type : 'post',
                url : "/comments/create",
                data : newCommentForm.serialize(),
                success : (data)=>{
                    console.log(data)
                    let newComment = commentToDom(data.data.comment);
                    $(`#comments-container-${data.data.comment.post}>ul`).prepend(newComment);
                },
                error : (error)=>{
                    console.log(error)
                }
            });
        });
    }
    createComment();

    const newPostDom = function(post,username){
        return `<li id="post-${post._id}" >
        <p>
        
         <small>
           <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete Post</a>
         </small>
        
         <h2>${post.content}</h2>
         <br>
         <small> Post by ${username}</small>
       </p>
       <div id="post-comment" >
        
         <form action="/comments/create" method="POST">
           <input type="text" name="content" placeholder="type yor comment">
           <input type="hidden" name="post" value="${post._id}">
           <input type="submit" value="add comment">
         </form>
        
       </div>
       <div id="post-comments-list" >
         <h4>comments</h4>
         <ul id="post-comments-${post._id}" >
          
         </ul>
       </div>
       </li>`
    }

    const commentToDom = function(comment){
        return `<li id="comment-${comment.id}" >
       ${comment.content}
      <br>
      <small>by ${comment.user.name}</small>
      
    
      <p>
        <a href="/comments/destroy/${comment.id}">X-Com</a>
      </p>
    
    </li>`
    }

    //method to delete post from the dom

    const deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function(data){
                    // console.log(data)
                    $(`#post-${data.data.post_id}`).remove();
                },
                error : function(err){
                    console.log(err);
                }
            })
        })
    }

    // console.log("heelo")
}