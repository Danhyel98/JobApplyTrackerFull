const multer = require('multer');
const path = require('path');

// Configure Multer storage and file naming
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/cv/'); // Specify the folder to save uploaded CVs
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Name file with current timestamp
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
