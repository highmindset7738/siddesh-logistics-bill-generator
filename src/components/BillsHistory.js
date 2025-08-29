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

  const generatePDFFromBill = async (bill) => {
    try {
      console.log('🔄 Generating PDF from bill data...');
      
      // Create a temporary div to render the bill
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Times New Roman, serif';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.color = '#000000';
      
      // Create bill HTML content
      tempDiv.innerHTML = `
        <div style="border: 2px solid #000000; padding: 40px; background: white;">
          <!-- Company Header -->
          <div style="text-align: center; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; margin: -40px -40px 30px -40px;">
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px; letter-spacing: 2px;">SIDDESH LOGISTICS</div>
            <div style="font-size: 16px; margin-bottom: 15px; font-style: italic;">TRANSPORT, CONTAINER, FLEET OWNER, ISO TANK CONTAINER HANDLING</div>
            <div style="font-size: 14px; line-height: 1.4;">
              📧 siddeshlogistics@gmail.com | 📱 +91 9876543210<br>
              📍 Industrial Area, Sector 15, Gurgaon, Haryana - 122001
            </div>
          </div>

          <!-- Bill Title -->
          <div style="text-align: center; font-size: 28px; font-weight: bold; margin: 30px 0; color: #dc2626; text-decoration: underline;">
            TRANSPORTATION BILL
          </div>

          <!-- Bill Info -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; gap: 40px;">
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin-bottom: 15px; color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px;">Bill Details</h3>
              <p><strong>Bill No:</strong> ${bill.billNumber}</p>
              <p><strong>Date:</strong> ${new Date(bill.billDate).toLocaleDateString()}</p>
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin-bottom: 15px; color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px;">Customer Details</h3>
              <p><strong>Name:</strong> ${bill.customerName}</p>
              <p><strong>Address:</strong> ${bill.customerAddress}</p>
            </div>
          </div>

          <!-- Amount Section -->
          <div style="margin-top: 30px; border: 2px solid #000000; padding: 20px; background-color: #f8f9fa;">
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px;">
              <span><strong>Total Amount:</strong></span>
              <span><strong>₹${bill.totalAmount.toLocaleString()}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px;">
              <span><strong>Advance Paid:</strong></span>
              <span><strong>₹${bill.paidAmount.toLocaleString()}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0 0 0; font-size: 18px; font-weight: bold; border-top: 2px solid #000000; padding-top: 10px; color: #dc2626;">
              <span><strong>Balance Amount:</strong></span>
              <span><strong>₹${bill.balanceAmount.toLocaleString()}</strong></span>
            </div>
          </div>

          <!-- Signature Section -->
          <div style="margin-top: 40px; text-align: right;">
            <p style="margin: 20px 0; font-size: 16px; font-weight: bold;">For SIDDESH LOGISTICS</p>
            <div style="margin: 20px 0; height: 60px;"></div>
            <p style="margin: 0; font-size: 16px; font-weight: bold;">Authorized Signature</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Generate canvas from the temporary div
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`SIDDESH_LOGISTICS_BILL_${bill.billNumber.replace(/\//g, '_')}.pdf`);
      
      console.log('✅ PDF generated and downloaded successfully!');
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
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
                  👁️ View & Download PDF
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
