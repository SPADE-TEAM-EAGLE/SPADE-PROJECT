
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

function fileUpload(req,res) {
    MultiUpload(req, res, function (err) {
       
        if (err) {
            return res.status(422).send({
                errors: [{ title: "File Upload Error", detail: err.message }],
            });
        }
        return res.json({
            images: (req.files["image"] && req.files["image"].map((file) => {
                return {
                    image_url: file.location,
                    image_key: file.key
                };
            })) || [],
            success: true,
            message: "File uploaded successfully"
        });
        
            
    });
}
function fileDelete(req, res) {
    const { key } = req.params;

    // Specify the bucket and key of the file you want to delete
    const params = {
        Bucket: "spades3bucket",
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
    fileDelete
};



