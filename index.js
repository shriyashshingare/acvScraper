const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const path = require('path');


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const cors = require('cors');
app.use(cors());

const apiRoutes = require('./routes/Route');

// handling the uplaod of the file
// const upload = multer({dest:'uploads/'})
// app.post('/api/fileUpload', upload.single('myFile'), (req,res) => {
//   let data = fs.readFileSync(req.file.path, 'utf-8', (e)=>{
//     console.log(e)
//     res.send({success:false, error:e})
//   });
//   res.send({sucess: true})
// })


app.use('/', apiRoutes);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Page not found');
    err.status = 404;
    next(err);
  });

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
    console.log(`Running on ${PORT}`);
  });