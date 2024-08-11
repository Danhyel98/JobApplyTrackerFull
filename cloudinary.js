const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { Readable } = require("stream");

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const uploadToCloudinary = (resourceType, folderPath, buffer) => {
  return new Promise((resolve, reject) => {
    const streamTransformer = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: folderPath },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
    let str = Readable.from(buffer);
    str.pipe(streamTransformer);
  });
};

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]);

module.exports = {
  uploadFields,
  uploadToCloudinary
};