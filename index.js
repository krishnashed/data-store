const express = require('express')
const multer  = require('multer')
const morgan = require('morgan')
const path = require('path');
const fs = require('fs');
const cors = require('cors')


const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(morgan('dev'));
app.use('/images', express.static('uploads'))

  //joining path of directory 
const imagesDir = path.join(__dirname, 'uploads');

var previousList = []

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() +".jpg")
    }
  })

var upload = multer({ storage: storage })


app.post("/upload", upload.array("image"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
}

app.get('/get-images', (req, res) => { 

  fs.readdir(imagesDir, function (err, files) {
      
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      res.json({data : files})
      // res.json({data : files.filter(item => !previousList.includes(item))})
      // previousList = files
  });
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(5000, () => {
  console.log(`Example app listening on port 5000`)
})