const User= require('../models/auth_model');
const { post } = require('../routes/auth_route');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hash } = require('bcrypt');
const nodemailer = require("nodemailer");
const _ = require('lodash');
const multer  = require('multer')

//var smtpTransport = require(‘nodemailer-smtp-transport’);

exports.signUp = async (req,res,next)=>
{
  console.log("Home");
    console.log(req.body);
    const user = await new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        address : req.body.address,        
        updatedAt : req.body.updatedAt,
        createdAt : req.body.createdAt
    })
    user.save()
.then(data => {
  res.json(data);
  console.log("user created");
}
).catch(next);
};
exports.login =  (req,res,next)=>
{
    console.log("indide");

     User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1)
        {
            return res.status(404).json({
                msg: "user not exist "
            })
        }
        console.log("before decrypt");
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>
        {
          console.log("inside decrypt");
            if(!result)
            {
                // return res.json(401).json({
                //     msg:"password matching fail"

                    
                // })
                    return res.status(404).json({ error: "No Profile Found" });

            }
            if (result)
            {
                jwt.sign({
                    email:user[0].email,
                    name:user[0].name,
                    address:user[0].address
                },
                'this is dummy text',
                {
                    expiresIn:"24h"
                },(err,token) =>{
                    res.status(200).json({
                        email:user[0].email,
                        name:user[0].name,
                        address:user[0].address,
                        token:token
                    })
                });
            }
        });        
    })
    .catch(err=>
        {
            res.json(500).json({
                err:err
            })
        })
};
//gets all the getRequest
exports.get = async (req,res,next)=>
{
    User.find()
    .exec()
    .then(result => {
        res.status(200).json({
            user:result
        })
    })
};
exports.getone= async (req,res,next)=>
{
    User.findById(req.params.id)
    .exec()
    .then(result => {
        res.status(200).json({
            user:result
        })
    })
};

exports.changePassword =  (req,res,next)=>
{
    console.log("indide");
     User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1)
        {
            return res.status(404).json({
                msg: "user not exist "
            })
        }
        console.log("before ");
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>
        {
          console.log("inside ");
            if(!result)
            {
                return res.json(401).json({
                    msg:"password matching fail"
                })
            }
            if (result)
            {
                console.log("password match with email ");
                if(req.body.newPassword == req.body.confirmPassword)
                {
                    console.log("new and confirm password match ho gya hai ");
                    user[0].password = req.body.newPassword;
                    console.log(user[0].password);

                    bcrypt.hash(req.body.newPassword, 15, (err,hash)=>{
                        user[0].password = hash;
                        console.log(user[0]);

                        user[0].save(function(err,user)
                        {
                            if(err) return console.error(err);
                            console.log("password changed");
                            res.json(user);
                        })                      
                    })                                 
                }           
            }          
        });              
    })
    .catch(err=>
        {
            res.json(500).json({
                err:err
            })
        })
};
exports.forgetPassword = (req,res)=>
{
    const {email} = req.body; 
    User.findOne({email},(err,user)=>{
        if(err || !user)    
        {
            return res.status(404).json({msg: "user not exist " })
        }
        const token = jwt.sign({_id :user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'20h'});        
          //      console.log(resetToken);
        return user.updateOne({resetToken: token} ,function(err,success)
        {
            if(err)
            {
                return res.status(404).json({msg: "reset password link error  " })
            }
             else
             {
                var transport = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "0504d9ecb4c5ea",
                      pass: "fc60a83f332af8"
                    }
                  });
                var mailOptions = {
                    from:'noreply@hello.com',
                    to : email,
                    subject: 'Forget Password link',
                    html:`
                    <h2>Please click on link to to Reset Password</h2>
                    <p>${process.env.CLIENT_URL}/reset password ${token} </p>`
                };        
                transport.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
             }
          //   console.log(resetToken);
            return res.json({msg: "reset password email sent " });
            
        })
    })
}

exports.resetPassword =(req,res)=>
{
    const {resetToken,newPassword} = req.body;
    if(resetToken)
    {
        jwt.verify(resetToken,process.env.RESET_PASSWORD_KEY,function(error,decodedData){
            if(error)
            {
                return res.status(401).json({
                    error:"incorrect token or expired token"
                })
            }
            User.findOne({resetToken},(err,user)=>
            {
                if(err || !user)    
                {
                    return res.status(404).json({msg: "user not exist " })
                }
                const obj ={
                    password : newPassword,
                    resetToken:''
                }
                user =_.extend(user,obj);
                user.save((err,result)=>{
                    if(err)
                    {
                        return res.status(400).json({msg: "reset password error" })   
                    }
                    else{
                        return res.status(200).json({msg: "password changed " }) 
                    }
                })
            })
          
        })
    }
    else
    {
        res.status(401).json({error: "Authencation error"});
    }
}

