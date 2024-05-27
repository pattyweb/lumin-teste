const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractAndInsertDataFromPDF } = require('./extractor'); // Importing extractDataFromPDF instead of extractFaturaData
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const pdfRoutes = require('./routes/pdfRoutes');
const pdfFilesRouter = require('./routes/pdfFiles');
const clienteRoute = require('./routes/clienteRoute');
const faturaRoute = require('./routes/faturaRoute');
const dashboardRoute = require('./routes/dashboardRoute');
const moment = require('moment');

const app = express();
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/postgres');

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use('/pdfs', pdfRoutes);
app.use('/pdfs', pdfFilesRouter); // For serving individual files
app.use('/api', clienteRoute);
app.use('/api', faturaRoute);
app.use('/api', dashboardRoute);

// Define the path to the directory for storing PDFs
const pdfsDirectory = path.join(__dirname, 'pdfs');

// Create the directory for storing PDFs if it doesn't exist
if (!fs.existsSync(pdfsDirectory)) {
  fs.mkdirSync(pdfsDirectory);
}

// Define the data model for Fatura
const Fatura = sequelize.define('Fatura', {
  numero_cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mes_referencia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  energia_eletrica_kwh: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  energia_eletrica_valor: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  energia_sceee_kwh: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  energia_sceee_valor: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  energia_compensada_kwh: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  energia_compensada_valor: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  contrib_ilum_publica_valor: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

// Configuration of multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pdfsDirectory);
  },
  filename: function (req, file, cb) {
    // Gerar um nome de arquivo único com base no horário do upload
    const uploadTime = moment().format('YYYYMMDD_HHmmss');
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const newFileName = `${uploadTime}_${generateRandomString(6)}${fileExtension}`; // Adicione um código aleatório para garantir unicidade
    cb(null, newFileName);
  }
});

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const upload = multer({ storage: storage });

// Route for uploading PDF files
app.post('/upload', upload.single('fatura'), async (req, res) => {
  const pdfPath = req.file.path;

  try {
    // Extract and insert data from the uploaded PDF file
    const extractedData = await extractAndInsertDataFromPDF(pdfPath);

    // Respond with the extracted data
    res.status(200).json({ extractedData });
  } catch (error) {
    console.error('Error extracting and inserting data from PDF:', error);
    res.status(500).json({ error: 'Error extracting and inserting data from PDF' });
  }
});


// Route for downloading uploaded PDF files
app.get('/pdfFiles/:filename', (req, res) => {
  const pdfFileName = req.params.filename;
  const pdfFilePath = path.join(pdfsDirectory, pdfFileName);

  res.download(pdfFilePath, pdfFileName, (err) => {
    if (err) {
      console.error('Error downloading PDF:', err);
      res.status(500).json({ error: 'Error downloading PDF' });
    }
  });
});


// Test endpoint
app.get('/test', (req, res) => {
  res.send('Test endpoint is working!');
});

module.exports = app;


// Define your server logic
let port = process.env.PORT || 3001; // Change const to let
if (process.env.NODE_ENV == 'test') {
  port = 0;
}

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
