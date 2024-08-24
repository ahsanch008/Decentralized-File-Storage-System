const express = require('express');
const multer = require('multer');
const { uploadFile, getFileById, shareFile ,transferFile,deleteFile,getHistory} = require('../controllers/FileController');

const router = express.Router();
const upload = multer(); 

router.post('/upload', upload.single('file'), uploadFile);
router.post('/share', shareFile);
router.post('/transfer', transferFile);

router.get('/:id', getFileById);
router.get('/history/:id', getHistory);

router.delete('/:id', deleteFile);

module.exports = router;
