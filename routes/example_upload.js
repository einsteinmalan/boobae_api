const express = require('express');
const app = express();
const multer = require("multer");
const path = require("path");

// storage engine

const storage = multer.diskStorage({
    destination: '../status_image',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10
    }
})
app.use('/mystatus', express.static('status_image'));
app.post("/upload", upload.single('image'), (req, res) => {

    res.json({
        success: 1,
        profile_url: `http://localhost:4000/mystatus/${req.file.filename}`
    })
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);

app.listen(4000, () => {
    console.log("server up and running");
})