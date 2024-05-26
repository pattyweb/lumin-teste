const fs = require('fs');
const PDFParser = require('pdf-parse');
const { Fatura, Cliente } = require('./models'); // Assuming you have Sequelize models defined

const extractAndInsertDataFromPDF = async (pdfPath) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Parse the PDF buffer using pdf-parse
    const pdf = await PDFParser(pdfBuffer);

    // Extract data from PDF text content
    const extractedData = extractDataFromPDF(pdf.text);

    // Insert into database
    if (extractedData.numeroCliente && extractedData.mesReferencia) {
      const [cliente, created] = await Cliente.findOrCreate({
        where: { numero_cliente: extractedData.numeroCliente },
        defaults: { nome_cliente: 'Unknown' } // You can set a default name if necessary
      });

      await Fatura.create({
        cliente_id: cliente.id,
        mes_referencia: extractedData.mesReferencia,
        energia_eletrica_kwh: extractedData.energiaEletrica.quantidade,
        energia_eletrica_valor: extractedData.energiaEletrica.valor,
        energia_sceee_kwh: extractedData.energiaSCEEE.quantidade,
        energia_sceee_valor: extractedData.energiaSCEEE.valor,
        energia_compensada_kwh: extractedData.energiaCompensada.quantidade,
        energia_compensada_valor: extractedData.energiaCompensada.valor,
        contribu_ilum_publica_valor: extractedData.contribIlumPublica
      });

      console.log('Data inserted successfully into the database.');
    } else {
      console.warn('Missing data for database insertion.');
    }

    return extractedData;
  } catch (error) {
    console.error('Error extracting and inserting data from PDF:', error);
    throw error;
  }
};

const extractDataFromPDF = (pdfText) => {
  // Define regular expressions to extract data from the PDF text
  const numeroClienteRegex = /Nº DO CLIENTE.*?(\d+)/s;
  const mesReferenciaRegex = /Referente a[\s\S]*?(\w{3}\/\d{4})/;
  const energiaEletricaRegex = /Energia Elétrica.*?(\d+)\s+\d+,\d+\s+(\d+,\d+)/s; 
  const energiaSceeeRegex = /Energia SCEE s\/ ICMS.*?(\d+)\s+\d+,\d+\s+(\d+,\d+)/s; 
  const energiaCompensadaRegex = /Energia compensada GD I.*?(\d+)\s+\d+,\d+\s+(-\d+,\d+)/s;
  const contribIlumPublicaRegex = /Contrib Ilum Publica Municipal\s*(\d+,\d+)/;

  // Match the regular expressions against the PDF text
  const numeroClienteMatch = numeroClienteRegex.exec(pdfText);
  const mesReferenciaMatch = mesReferenciaRegex.exec(pdfText);
  const energiaEletricaMatch = pdfText.match(energiaEletricaRegex);
  const energiaSceeeMatch = pdfText.match(energiaSceeeRegex);
  const energiaCompensadaMatch = pdfText.match(energiaCompensadaRegex);
  const contribIlumPublicaMatch = pdfText.match(contribIlumPublicaRegex);

  // Extracted data object
  const extractedData = {
    numeroCliente: numeroClienteMatch ? numeroClienteMatch[1] : null,
    mesReferencia: mesReferenciaMatch ? mesReferenciaMatch[1] : null,
    energiaEletrica: {
      quantidade: energiaEletricaMatch ? parseFloat(energiaEletricaMatch[1].replace(',', '.')) : null,
      valor: energiaEletricaMatch ? parseFloat(energiaEletricaMatch[2].replace(',', '.')) : null,
    },
    energiaSCEEE: {
      quantidade: energiaSceeeMatch ? parseFloat(energiaSceeeMatch[1].replace(',', '.')) : null,
      valor: energiaSceeeMatch ? parseFloat(energiaSceeeMatch[2].replace(',', '.')) : null,
    },
    energiaCompensada: {
      quantidade: energiaCompensadaMatch ? parseFloat(energiaCompensadaMatch[1].replace(',', '.')) : null,
      valor: energiaCompensadaMatch ? parseFloat(energiaCompensadaMatch[2].replace(',', '.')) : null,
    },
    contribIlumPublica: contribIlumPublicaMatch ? parseFloat(contribIlumPublicaMatch[1].replace(',', '.')) : null,
  };

  // Return the extracted data object
  return extractedData;
};


module.exports = { extractAndInsertDataFromPDF };
