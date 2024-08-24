const File = require('../models/File');
const { uploadFileToStorj, getFileFromStorj } = require('../utils/storj');

// Upload file to Storj and save metadata in MongoDB
exports.uploadFile = async (req, res) => {
  try {
    const { originalname, buffer, mimetype, size } = req.file;
    const { uploader } = req.body;
    const bucketName = 'decentralized-file-system'; // Replace with your Storj bucket name

    // Upload file to Storj
    const storjPath = await uploadFileToStorj(buffer, bucketName, originalname);

    // Save file metadata to MongoDB
    const file = new File({
      filename: originalname,
      storjPath,
      uploader,
      size,
      mimeType: mimetype,
    });
    await file.save();

    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve file metadata and content from Storj
exports.getFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileContent = await getFileFromStorj('decentralized-file-system', file.filename);

    res.json({ file, content: fileContent.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete file metadata and content from Storj
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from Storj (if needed, implement deletion logic)

    await file.remove();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
