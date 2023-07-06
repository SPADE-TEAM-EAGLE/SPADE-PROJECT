
const express = require("express");
const router = express.Router();

const upload = require("../controllers/s3CloudController");

const MultiUpload = upload.fields([
    { name: "image", required: false },
    { name: "video",required: false },
    { name: "doc",  required: false },
    { name: "audio",  required: false },
]);

function fileUpload(req, res) {
    MultiUpload(req, res, function (err) {
        if (err) {
            return res.status(422).send({
                errors: [{ title: "File Upload Error", detail: err.message }],
            });
        }
        return res.json({
            image_url: (req.files["image"] && req.files["image"].map((file) => file.location)) || null,
            video_url: (req.files["video"] && req.files["video"][0].location) || null,
            doc_url: (req.files["doc"] && req.files["doc"][0].location) || null,
            audio_url: (req.files["audio"] && req.files["audio"][0].location) || null,
            success: true,
            message: "File uploaded successfully",
        }); 
    });
}

module.exports = fileUpload;



