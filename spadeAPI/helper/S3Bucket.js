
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
       console.log(req.files)
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
const deleteImageFromS3 = (key) => {
    const params = {
      Bucket: 'spades3bucket',
      Key: key
    };
  
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error('Error deleting image from S3:', err);
        // Handle the error accordingly
      } else {
        console.log('Image deleted successfully from S3');
        // Perform any desired actions after successful deletion
      }
    });
  };
  
module.exports = {
    fileUpload,
    deleteImageFromS3
};



