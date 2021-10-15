const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
require('dotenv/config');
var cors = require('cors');
app.use(cors())


// Body-parser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


// import routes 
const authRoutes = require('./routes/auth_route');
const routes = require('./routes/routes'); 

const uploadimage = require('./routes/uploadImage');


//  error handling middlewares
app.use('/auth',authRoutes);

app.use('/auth',uploadimage);


app.use(function(err,req,res,next)
{
res.send({error : err.message});
});

//   connect to the database
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });

// configure the server's port
var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})