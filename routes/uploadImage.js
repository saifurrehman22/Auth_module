var express = require('express');
var app = express();
const router = express.Router();
var multer = require('multer')
var Gallery = require('../models/gallery.js');
const url = require("url");
var port = process.env.PORT || '3000';
var cors = require('cors');
app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
var upload = multer({ storage: storage })

router.post('/single', upload.single('image'), function(req, res, next) {
  if(!req.file) {
      return res.status(500).send({ message: 'Upload fail'});
  } else {
  //    req.body.imageUrl = 'http://192.168.0.7:3000/images/' + req.file.filename;
      req.body.imageUrl =  req.file.filename;
      Gallery.create(req.body, function (err, gallery) {
          if (err) {
              console.log(err);
              return next(err);
          }
          res.json({baseurl : process.env.baseurl + req.body.imageUrl , data: gallery});
          console.log(req.file);
      });
  }
});

module.exports=router;


