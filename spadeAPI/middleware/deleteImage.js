const fs = require('fs');
const path = require('path');
const folderPath = 'uploads/';
imageToDelete = (fileNames) => {
  fileNames.forEach((fileName) => {
    const imagePath = path.join(folderPath, fileName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image: ${fileName}`);
    } else {
      console.log(`Image not found: ${fileName}`);
    }
  });
}
module.exports = imageToDelete;
