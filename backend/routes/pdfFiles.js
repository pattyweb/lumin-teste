const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const pdfFilePath = path.join(__dirname, '../pdfs', filename);

  // Extract Nº DO CLIENTE and Referente a from the filename
  const [numeroCliente, mesReferencia] = filename.split('-');

  fs.readFile(pdfFilePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Error reading file' });
    } else {
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Send response with additional metadata
      res.json({
        numeroCliente,
        mesReferencia,
        fileData: data.toString('base64') // Convert file data to base64 for sending in JSON
      });
    }
  });
});

module.exports = router;

