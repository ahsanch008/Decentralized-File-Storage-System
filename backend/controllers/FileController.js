// app.js

const mongoose = require('mongoose');
const Web3 = require('web3');
const { uploadFileToStorj, getFileFromStorj } = require('./utils/storj');
const { uploadFileMetadata, getFileMetadata, updateFileAccess, transferFile, deleteFileMetadata, getFileHistory } = require('./utils/blockchainUtils');
const File = require('../models/File');


// File Upload
exports.uploadFile= async (req, res) => {
    try {
        const { originalname, buffer, mimetype, size } = req.file;
        const { userId } = req.body;

        const storjPath = await uploadFileToStorj(buffer, 'your-bucket-name', originalname);
        const fileHash = Web3.utils.sha3(originalname + storjPath);

        const file = new File({
            filename: originalname,
            storjPath,
            size,
            mimeType: mimetype,
            owner: userId
        });
        await file.save();

        await uploadFileMetadata(fileHash, originalname, storjPath, size, mimetype);

        res.status(201).json({ message: 'File uploaded successfully', fileId: file._id });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

// File Retrieval
exports.getFileById= async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const fileHash = Web3.utils.sha3(file.filename + file.storjPath);
        const blockchainMetadata = await getFileMetadata(fileHash);

        if (!blockchainMetadata.hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const fileContent = await getFileFromStorj('your-bucket-name', file.storjPath);

        res.json({
            file,
            blockchainMetadata,
            content: fileContent.toString('base64')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving file', error: error.message });
    }
};

// File Sharing
exports.shareFile= async (req, res) => {
    try {
        const { fileId, userId } = req.body;
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const fileHash = Web3.utils.sha3(file.filename + file.storjPath);
        await updateFileAccess(fileHash, userId, true);

        res.json({ message: 'File shared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing file', error: error.message });
    }
};

// File Transfer
exports.transferFile= async (req, res) => {
    try {
        const { fileId, newOwnerId } = req.body;
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const fileHash = Web3.utils.sha3(file.filename + file.storjPath);
        await transferFile(fileHash, newOwnerId);

        file.owner = newOwnerId;
        await file.save();

        res.json({ message: 'File transferred successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error transferring file', error: error.message });
    }
};

// File Deletion
exports.deleteFile= async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await deleteFileFromStorj('your-bucket-name', file.storjPath);
        await file.remove();

        const fileHash = Web3.utils.sha3(file.filename + file.storjPath);
        await deleteFileMetadata(fileHash);

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
};

// File History
exports.getHistory= async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const fileHash = Web3.utils.sha3(file.filename + file.storjPath);
        const history = await getFileHistory(fileHash);

        res.json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving file history', error: error.message });
    }
};
