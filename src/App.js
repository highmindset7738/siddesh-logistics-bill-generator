import React, { useState } from 'react';
import Header from './components/Header';
import BillForm from './components/BillForm';
import BillPreview from './components/BillPreview';
import BillsHistory from './components/BillsHistory';
import billService from './appwrite/billService';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('form');
  const [showPreview, setShowPreview] = useState(false);
  const [savedBillId, setSavedBillId] = useState(null);
  
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

  const handleFormSubmit = async (formData) => {
    setBillData(formData);
    
    // Save to Appwrite
    try {
      const savedBill = await billService.createBill(formData);
      setSavedBillId(savedBill.$id); // Store the bill ID for PDF saving
      console.log('Bill saved to Appwrite successfully:', savedBill);
    } catch (error) {
      console.error('Failed to save bill to Appwrite:', error);
      setSavedBillId(null);
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
            <BillPreview billData={billData} onBack={handleBackToForm} savedBillId={savedBillId} />
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
