const multer = require('multer');
const Path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('image');
const uploadExistingFiles = async (req, res, next) => {
    try {
        existingImages=existingImages.split(",")
      if (existingImages && existingImages.length > 0) {
        const existingFiles = existingImages.map((imageName) => ({
          fieldname: 'image',
          originalname: imageName,
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'uploads',
          filename: imageName,
          path: `uploads/${imageName}`
        }));
        req.files = [...(req.files || []), ...existingFiles];
      }
      next();
    } catch (error) {
      console.log(error);
      return res.send("Error while uploading existing files");
    }
  };
module.exports = {upload,uploadExistingFiles};
