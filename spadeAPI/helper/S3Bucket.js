
const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");

const upload = require("../controllers/s3CloudController");

const MultiUpload = upload.fields([
    { name: "image", required: false },
    { name: "video", required: false },
    { name: "doc", required: false },
    { name: "audio", required: false },
]);

const s3 = new aws.S3();

// function fileUpload(req, res) {
function fileUpload(file) {
    MultiUpload(req, res, function (err) {
        if (err) {
            return res.status(422).send({
                errors: [{ title: "File Upload Error", detail: err.message }],
            });
        }
        return res.json({
            image_url: (file["image"] && file["image"]) || null,
            video_url: (req.files["video"] && req.files["video"].map((file) => file.location)) || null,
            doc_url: (req.files["doc"] && req.files["doc"].map((file) => file.location)) || null,
            audio_url: (req.files["audio"] && req.files["audio"].map((file) => file.location)) || null,
            success: true,
            message: "File uploaded successfully",
        });
    });
}
function fileDelete(req, res) {
    const { key } = req.params;

    // Specify the bucket and key of the file you want to delete
    const params = {
        Bucket: "ncai-pcm-db",
        Key: key,
    };
    // Delete the file from the bucket
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete the file" });
        }
        // File deletion successful
        return res.json({ message: "File deleted successfully" });
    });
}
module.exports = {
    fileUpload,
    fileDelete,
};



