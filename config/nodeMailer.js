//This is the config file for the nodemailer package, it consists of two basic functions (Transporter and renderTemplate)
const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//Transporter == This is the part which sends the emails, it defines how the communication is going to take place. point to note that in the auth obj, u gotta put your gmail username/password which gmail will verify before using the mail service. if u are using 2FA then u must create a perticuler application password in google settings or you will get error.
let transporter = nodeMailer.createTransport({
    service : 'gmail',
    host : 'smpt.gmail.com',
    port : 587,
    secure : false,
    auth : {
        user : 'pratikpriyadarshi1998@gmail.com',
        pass : 'irziidfnblugwhqn'
    }
});
 
//RenderTemplate defines whenever i am going to send an HTML email and the file would be placed inside Views
let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    //This ejs renderfile function needs the full path of the ejs file, the data to be sent as context(comment data in this case) and a callback function to handle errors if any.
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log("Error in rendering template");
                return;
            }
            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}