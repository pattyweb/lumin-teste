import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoicesPage = () => {
  const [originalInvoices, setOriginalInvoices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/pdfs');
      setOriginalInvoices(response.data.files);
      setInvoices(response.data.files.map(() => ''));
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:3001/pdfFiles/${fileName}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/faturas/search/${searchTerm}`);
      console.log('Search Response:', response.data); // Log the response for debugging
      const faturas = response.data.faturas;
      if (faturas && faturas.length > 0) {
        const clienteNumeros = faturas.map((fatura) => fatura.cliente?.numero_cliente);
        const mesReferencias = faturas.map((fatura) => fatura.mes_referencia); // Extract mes_referencia
        console.log('Cliente Numeros:', clienteNumeros); // Log the cliente numeros for debugging
        console.log('Mes Referencias:', mesReferencias); // Log the mes_referencia values
        setInvoices(faturas.map((fatura, index) => ({ cliente: clienteNumeros[index], mes_referencia: mesReferencias[index] }))); // Update invoices state with cliente and mes_referencia
      } else {
        console.log('No faturas found'); // Log when no faturas are found for debugging
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error searching invoices:', error);
      setInvoices([]);
    }
  };
  
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('fatura', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload Response:', response.data);
      fetchInvoices();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Logic to paginate invoices
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Logic to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="mt-4">Bibiloteca de Faturas</h2>
    <div className="mb-3">
      <label htmlFor="search" className="form-label">Procurar Nº DO CLIENTE:</label>
      <div className="d-flex">
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control me-2"
        />
        <button onClick={handleSearch} className="btn btn-primary">Procurar</button>
      </div>
    </div>
     {/* Upload button */}
     <div className="mb-3">
        <input type="file" onChange={handleFileUpload} className="form-control" />
      </div>
      <h3>Faturas Disponíveis</h3>
      <ul className="list-group">
        {currentInvoices.map((invoice, index) => (
          <li key={index} className="list-group-item">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <button onClick={() => handleDownload(originalInvoices[index])} className="btn btn-sm btn-secondary me-2">Download da Fatura</button>
                <span>{invoice.mes_referencia}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Pagination */}
      <nav aria-label="Page navigation">
        <ul className="pagination mt-3">
          {Array.from({ length: Math.ceil(invoices.length / itemsPerPage) }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">{index + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default InvoicesPage;