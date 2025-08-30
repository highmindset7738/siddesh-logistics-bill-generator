import React, { useState, useEffect } from 'react';
import billService from '../appwrite/billService';
import './BillsHistory.css';

const BillsHistory = ({ onBack, onViewBill }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

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

  const handleStatusToggle = async (billId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    const confirmMessage = `Mark this bill as ${newStatus.toUpperCase()}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await billService.updateBillStatus(billId, newStatus);
        setBills(bills.map(bill => 
          bill.$id === billId ? { ...bill, status: newStatus } : bill
        ));
      } catch (err) {
        alert('Failed to update bill status');
        console.error('Error updating bill status:', err);
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

  // Filter bills based on search term and active tab
  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = bill.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bills-history">
        <div className="loading">Loading bills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bills-history">
        <div className="error">{error}</div>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Form
        </button>
      </div>
    );
  }

  return (
    <div className="bills-history">
      <div className="bills-header">
        <h2> Bills History</h2>
      </div>
      <div className="status-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending ({bills.filter(b => b.status === 'pending').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveTab('paid')}
        >
          ✅ Paid ({bills.filter(b => b.status === 'paid').length})
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by bill number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredBills.length === 0 ? (
        <div className="no-bills">
          {searchTerm ? (
            <>
              <p>No bills found matching "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} className="btn btn-primary">
                Clear Search
              </button>
            </>
          ) : (
            <>
              <p>No bills found. Create your first bill!</p>
              <button onClick={onBack} className="btn btn-primary">
                Create New Bill
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bills-grid">
          {filteredBills.map((bill) => (
            <div key={bill.$id} className="bill-card">
              <div className="bill-card-header">
                <h3>{bill.billNumber}</h3>
                <span className="bill-date">{formatDate(bill.billDate)}</span>
              </div>
              
              <div className="bill-card-content">
                <div className="customer-info">
                  <p><strong>Customer:</strong> {bill.customerName}</p>
                  <p><strong>Address:</strong> {bill.customerAddress}</p>
                </div>
                
                <div className="amount-info">
                  <div className="amount-row">
                    <span>Total:</span>
                    <span>{formatCurrency(bill.totalAmount)}</span>
                  </div>
                  <div className="amount-row">
                    <span>Advance:</span>
                    <span>{formatCurrency(bill.paidAmount)}</span>
                  </div>
                  <div className="amount-row balance">
                    <span>Balance:</span>
                    <span>{formatCurrency(bill.balanceAmount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bill-card-actions">
                <button 
                  onClick={() => onViewBill(bill)}
                  className="btn btn-secondary"
                >
                   View
                </button>
                <button 
                  onClick={() => handleStatusToggle(bill.$id, bill.status)}
                  className={`btn ${bill.status === 'pending' ? 'btn-success' : 'btn-warning'}`}
                >
                  {bill.status === 'pending' ? '✅ Mark Paid' : '⏳ Mark Pending'}
                </button>                <button 
                  onClick={() => handleDelete(bill.$id)}
                  className="btn btn-danger"
                >
                   Delete
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
