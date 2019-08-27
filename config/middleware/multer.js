// Configure multer for handling multipart/form-data
var multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };