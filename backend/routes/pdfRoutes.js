const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
    const pdfsDirectory = path.join(__dirname, '../pdfs');
    const searchTerm = req.query.searchTerm;

    fs.readdir(pdfsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).json({ error: 'Error reading directory' });
        } else {
            let filteredFiles = files;
            if (searchTerm) {
                filteredFiles = files.filter(file => file.includes(searchTerm));
            }
            res.status(200).json({ files: filteredFiles });
        }
    });
});

module.exports = router;



