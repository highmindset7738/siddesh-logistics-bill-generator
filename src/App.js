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
  const [viewingHistoryBill, setViewingHistoryBill] = useState(false);
  
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
    if (viewingHistoryBill) {
      // If viewing a history bill, go back to history page
      setViewingHistoryBill(false);
      setShowPreview(false);
      setCurrentPage('history');
      setSavedBillId(null);
    } else {
      // Normal back to form
      setShowPreview(false);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setShowPreview(false);
  };

  const handleViewBill = async (bill) => {
    try {
      // Fetch shipments for this bill
      const shipments = await billService.getShipments(bill.$id);
      
      // Convert shipments to form format
      const formattedShipments = shipments.map(shipment => ({
        srNo: shipment.srNo,
        date: shipment.shipmentDate,
        containerNo: 'N/A', // Not stored in collection
        vehicleNo: shipment.vehicleNo,
        from: shipment.fromLocation,
        to: shipment.toLocation,
        weight: shipment.weight,
        totalFair: shipment.totalFair,
        total: shipment.totalFair
      }));

      // If no shipments found, create a default one
      const shipmentsToUse = formattedShipments.length > 0 ? formattedShipments : [
        {
          srNo: 1,
          date: bill.billDate,
          containerNo: 'N/A',
          vehicleNo: 'N/A', 
          from: 'N/A',
          to: 'N/A',
          weight: 'N/A',
          totalFair: bill.totalAmount,
          total: bill.totalAmount
        }
      ];

      // Convert Appwrite bill data back to form format for preview
      const formattedBillData = {
        billNo: bill.billNumber,
        date: bill.billDate,
        customerName: bill.customerName,
        customerAddress: bill.customerAddress,
        shipments: shipmentsToUse,
        totalAmount: bill.totalAmount,
        advanceAmount: bill.paidAmount,
        balanceAmount: bill.balanceAmount
      };
      
      setBillData(formattedBillData);
      setSavedBillId(bill.$id);
      setViewingHistoryBill(true);
      setShowPreview(true);
      setCurrentPage('form');
    } catch (error) {
      console.error('Error viewing bill:', error);
      alert('Error loading bill details. Please try again.');
    }
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
