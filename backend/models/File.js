const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  storjPath: { // This will store the path or URL to the file on Storj
    type: String,
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who uploaded the file
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  size: { // The size of the file in bytes
    type: Number,
    required: true,
  },
  mimeType: { // The MIME type of the file (e.g., image/png, application/pdf)
    type: String,
    required: true,
  }
});

const File = mongoose.model('File', FileSchema);
module.exports = File;
