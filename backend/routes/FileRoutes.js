const express = require('express');
const multer = require('multer');
const { uploadFile, getFile, deleteFile } = require('../controllers/FileController');

const router = express.Router();
const upload = multer(); 

router.post('/upload', upload.single('file'), uploadFile);

router.get('/:id', getFile);

router.delete('/:id', deleteFile);

module.exports = router;
