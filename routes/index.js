var express = require('express');
var router = express.Router();
const multer  = require('multer')
const date = require('date-and-time')

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.w25kobr.mongodb.net/').then((error)=>{
  if (error == null) console.log("okkkkkkkkkkkkkkkkkkkkkk");
});

const Avartar = new mongoose.Schema({
  ngayTao: String,
  moTa: String,
  tieuDe:String,
  linkIMG:String
})

const {MulterError, diskStorage} = require("multer");
const path = require("path");
const {now} = require("mongoose");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {

    cb(null,Date.now()+"-"+Math.random()+ file.originalname)
  },


})
const upload = multer({ storage: storage ,limits:{
    fileSize: 2*1024*1024,
  },}).single("anh")




/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.get('/danhSach',function (req,res) {
  const  img =mongoose.model('anh',Avartar);


  img.find().then(data =>{

    res.render('danhSach',{title: 'Express',data:data})
})

})
router.get('/loadIMG',function (req,res) {
const  img =mongoose.model('anh',Avartar);
let list;
img.find({}).then(data =>{
  res.render('loadIMG',)
})

  res.render('loadIMG', { title: 'Express' });
})
router.get('/IMGchiTiet',function (req,res) {
  const  img =mongoose.model('anh',Avartar);
  const  id = req.query.id;
  console.log(id);

  img.findById({_id:id}).then(data =>{

    res.render('IMGchiTiet',{title: 'Express',data:data})
  })




})
router.post('/loadThanhCong',function (req,res) {
  upload(req,res,function (err) {
    if (err instanceof MulterError){

      res.send("lôiiiiiiiiiiiiiiii")
    }else {
      const linkIMG =req.file.path;
      const now  =  new Date();
      const ngayTao = date.format(now,'DD/MM/YYYY HH:mm:ss');

      const tieuDe = req.body.tieuDe;

      const moTa = req.body.moTa;
      const load = mongoose.model('anh',Avartar);
      const avartar = new load({
        ngayTao: ngayTao,
        moTa: moTa,
        tieuDe:tieuDe,
        linkIMG:linkIMG
      })
      avartar.save().then(error =>{
        if (error != null){
          res.render('index', { title: 'HOME' });
        }else {
          res.render('loadIMG',{title: 'Them  That Bai'})
        }
      })

    }
  })

})
router.post('/DeleteImage',function (req,res) {
  const  img =mongoose.model('anh',Avartar);
  const id = req.body.idImg;


  img.deleteOne({_id:''+id}).then(data => {
    if (data != null){
      img.find().then(data =>{

        res.render('danhSach',{title: 'Express',data:data})
      })
    }
  })
})
router.post('/UpdateImage', function (req, res) {
  const id = req.body.idImg;
  const title = req.body.titleImg;
  const date = req.body.dateImg;
  const mt = req.body.motaImg;
  const link = req.body.limk;


  const img = mongoose.model('anh',Avartar);
  img.updateOne( {_id:''+id}, {
    ngayTao: date,
    moTa: mt,
    tieuDe:title,
    linkIMG:link
  }).then(data =>{
    if (data != null){
      img.find().then(data =>{

        res.render('danhSach',{title: 'Express',data:data})
      })
    }
  })
})




module.exports = router;
