import React, { useState } from 'react';
import Header from './components/Header';
import BillForm from './components/BillForm';
import BillPreview from './components/BillPreview';
import BillsHistory from './components/BillsHistory';
import billService from './appwrite/billService';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('form');
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

  const handleFormSubmit = async (formData) => {
    setBillData(formData);
    
    // Save to Appwrite
    try {
      await billService.createBill(formData);
      console.log('Bill saved to Appwrite successfully');
    } catch (error) {
      console.error('Failed to save bill to Appwrite:', error);
      // Continue to show preview even if save fails
    }
    
    setShowPreview(true);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setShowPreview(false);
  };

  const handleViewBill = (bill) => {
    // Convert Appwrite bill data back to form format
    const formattedBillData = {
      billNo: bill.billNumber,
      date: bill.billDate,
      customerName: bill.customerName,
      customerAddress: bill.customerAddress,
      shipments: [
        {
          srNo: 1,
          date: bill.billDate,
          containerNo: '',
          vehicleNo: '',
          from: '',
          to: '',
          weight: '',
          totalFair: bill.totalAmount,
          total: bill.totalAmount
        }
      ],
      totalAmount: bill.totalAmount,
      advanceAmount: bill.paidAmount,
      balanceAmount: bill.balanceAmount
    };
    
    setBillData(formattedBillData);
    setShowPreview(true);
    setCurrentPage('form');
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'form' && (
        <>
          {!showPreview ? (
            <BillForm onSubmit={handleFormSubmit} initialData={billData} />
          ) : (
            <BillPreview billData={billData} onBack={handleBackToForm} />
          )}
        </>
      )}
      
      {currentPage === 'history' && (
        <BillsHistory 
          onBack={() => handleNavigate('form')} 
          onViewBill={handleViewBill}
        />
      )}
    </div>
  );
}

export default App;
