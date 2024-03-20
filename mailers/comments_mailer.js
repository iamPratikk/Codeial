const nodeMailer = require('../config/nodeMailer')

//another way of exporting a method
exports.newComment = (comment)=>{
//as we wrote the renderTemplate function in Nodemailer config, we have to pass data for context and the relative path of the template(with the ejs extension)
let HTMLString = nodeMailer.renderTemplate({comment:comment}, 'comments/new_comment.ejs');

//This transporter is mainly responsible for sending the mails
nodeMailer.transporter.sendMail({
    from : 'pratikpriyadarshi1998@gmail.com',
    to : comment.user.email,
    subject : "New Comment is Published",
    html : HTMLString
},(err,info)=>{
    if(err){
        console.log("Error in sending email",err)
        return;
    }
    console.log("Mail Send Succesfully",info)
    return;
})
}