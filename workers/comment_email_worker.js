const queue = require('../config/kue');

const commentMailer = require('../mailers/comments_mailer');

queue.process('emails',(job,done)=>{
    console.log("emails worker is processing the job", job.data)
    commentMailer.newComment(job.data);
    done();
});