import React, { useState } from 'react';
import BillForm from './components/BillForm';
import BillPreview from './components/BillPreview';
import './App.css';

function App() {
  const [billData, setBillData] = useState({
    billNo: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerAddress: '',
    shipments: [
      {
        srNo: 1,
        date: '',
        containerNo: '',
        vehicleNo: '',
        from: '',
        to: '',
        weight: '',
        totalFair: '',
        total: ''
      }
    ],
    totalAmount: 0,
    advanceAmount: 0,
    balanceAmount: 0
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleFormSubmit = (formData) => {
    setBillData(formData);
    setShowPreview(true);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚛 Siddesh Logistics Bill Generator</h1>
        <p>Professional bill generation for logistics services</p>
      </header>

      {!showPreview ? (
        <BillForm onSubmit={handleFormSubmit} initialData={billData} />
      ) : (
        <BillPreview 
          billData={billData} 
          onBack={handleBackToForm}
        />
      )}
    </div>
  );
}

export default App;
