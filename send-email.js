var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'sriyank.siddhartha@gmail.com',
//     pass: 'xxxx'
//   }
// });
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0504d9ecb4c5ea",
      pass: "fc60a83f332af8"
    }
  });

// var mailOptions = {
//   from: 'sriyank.siddhartha@gmail.com',
//   to: 'smartherd@gmail.com, sriyank@smartherd.com',
//   subject: 'Sending Email using Node.js',
//   text: `Hi Smartherd, thank you for your nice Node.js tutorials.
//           I will donate 50$ for this course. Please send me payment options.`
//   // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
// };

var mailOptions = {
    from:'noreply@hello.com',
    to : email,
    subject: 'Forget Password link',
    html:`
    <h2>Please click on link to to Reset Password</h2>
    <p>${process.env.CLIENT_URL}/reset password ${token} </p>`
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});