import React, { useState, useEffect } from 'react';
import billService from '../appwrite/billService';
import './BillsHistory.css';

const BillsHistory = ({ onBack, onViewBill }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const billsData = await billService.getBills();
      setBills(billsData);
    } catch (err) {
      setError('Failed to fetch bills');
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billService.deleteBill(billId);
        setBills(bills.filter(bill => bill.$id !== billId));
      } catch (err) {
        alert('Failed to delete bill');
        console.error('Error deleting bill:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bills-history">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading bills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bills-history">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchBills} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bills-history">
      <div className="history-header">
        <h2>📋 Bills History</h2>
        <p>Total Bills: {bills.length}</p>
      </div>

      {bills.length === 0 ? (
        <div className="no-bills">
          <div className="no-bills-icon">📄</div>
          <h3>No Bills Found</h3>
          <p>Create your first bill to see it here.</p>
          <button onClick={onBack} className="btn btn-primary">
            Create New Bill
          </button>
        </div>
      ) : (
        <div className="bills-grid">
          {bills.map((bill) => (
            <div key={bill.$id} className="bill-card">
              <div className="bill-card-header">
                <h3>Bill #{bill.billNumber}</h3>
                <span className="bill-date">{formatDate(bill.billDate)}</span>
              </div>
              
              <div className="bill-card-body">
                <div className="customer-info">
                  <strong>{bill.customerName}</strong>
                  <p className="customer-address">{bill.customerAddress}</p>
                </div>
                
                <div className="amount-info">
                  <div className="amount-row">
                    <span>Total:</span>
                    <strong>{formatCurrency(bill.totalAmount)}</strong>
                  </div>
                  <div className="amount-row">
                    <span>Paid:</span>
                    <span>{formatCurrency(bill.paidAmount)}</span>
                  </div>
                  <div className="amount-row balance">
                    <span>Balance:</span>
                    <strong>{formatCurrency(bill.balanceAmount)}</strong>
                  </div>
                </div>
              </div>
              
              <div className="bill-card-actions">
                <button 
                  onClick={() => onViewBill(bill)}
                  className="btn btn-secondary"
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => handleDelete(bill.$id)}
                  className="btn btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsHistory;
