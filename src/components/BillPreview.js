import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './BillPreview.css';

const BillPreview = ({ billData, onBack }) => {
  const billRef = useRef();

  const generatePDF = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

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

    pdf.save(`SIDDESH_LOGISTICS_BILL_${billData.billNo.replace('/', '_')}.pdf`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  return (
    <div className="preview-container">
      <div className="preview-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Form
        </button>
        <button className="btn btn-success" onClick={generatePDF}>
          📥 Download PDF
        </button>
      </div>

      <div className="bill-wrapper">
        <div ref={billRef} className="bill-container">
          {/* Company Header */}
          <div className="company-name">SIDDESH LOGISTICS</div>
          <div className="company-subtitle">TRANSPORT, CONTAINER, FLEET OWNER, ISO TANK CONTAINER HANDLING</div>
          <div className="company-subtitle">SPECIALIST IN : FACTORY STUFF EXPORT & IMPORT CONTAINER</div>
          <div className="divider"></div>
          <div className="company-contact">
            OFFICE NO : 558 SHIV CHEMBER 332-11 CBD BELAPUR NAVI MUMBAI- 400614<br />
            CALL: 91-22-27576351/7506201090 | E-mail: siddeshlogistics@gmail.com | MOB: 9677746581
          </div>

          {/* Bill Header Information */}
          <div className="bill-header">
            <div className="customer-info">
              <strong>TO:</strong><br />
              {billData.customerName}<br />
              {billData.customerAddress.split('\n').map((line, index) => (
                <span key={index}>
                  {line}<br />
                </span>
              ))}
            </div>
            <div className="bill-info">
              <strong>BILL NO:</strong> {billData.billNo}<br />
              <strong>DATE:</strong> {formatDate(billData.date)}
            </div>
          </div>

          {/* Shipment Details Table */}
          <table className="shipment-table">
            <thead>
              <tr>
                <th>SR NO</th>
                <th>DATE</th>
                <th>CONTAINER NO</th>
                <th>VEHICLE NO</th>
                <th>FORM</th>
                <th>TO</th>
                <th>WT.</th>
                <th>TOTAL FAIR</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {billData.shipments.map((shipment, index) => (
                <tr key={index}>
                  <td>{shipment.srNo}</td>
                  <td>{formatDate(shipment.date)}</td>
                  <td>{shipment.containerNo}</td>
                  <td>{shipment.vehicleNo}</td>
                  <td>{shipment.from}</td>
                  <td>{shipment.to}</td>
                  <td>{shipment.weight}</td>
                  <td>{parseFloat(shipment.totalFair || 0).toLocaleString()}</td>
                  <td>{parseFloat(shipment.total || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Account Details and Payment Summary */}
          <div className="bottom-section">
            <div className="account-details">
              <strong>Account Holder:</strong> SIDDESH LOGISTICS<br />
              <strong>Account Number:</strong> 50200804632292<br />
              <strong>IFSC:</strong> HDFC0001097<br />
              <strong>Branch:</strong> MUMBAI
            </div>
            <div className="payment-summary">
              <table>
                <tr>
                  <td><strong>TOTAL</strong></td>
                  <td><strong>{billData.totalAmount.toLocaleString()}.00</strong></td>
                </tr>
                <tr>
                  <td><strong>ADVANCE</strong></td>
                  <td><strong>{(billData.advanceAmount || 0).toLocaleString()}.00</strong></td>
                </tr>
                <tr>
                  <td><strong>BALANCE</strong></td>
                  <td><strong>{billData.balanceAmount.toLocaleString()}.00</strong></td>
                </tr>
              </table>
            </div>
          </div>

          {/* Rupees Section */}
          <div className="rupees-section">
            <strong>RUPEES :</strong> ________________________________________________________________________________________________
          </div>

          {/* Terms & Conditions and Signature Section */}
          <div className="terms-signature-section">
            <div className="terms-left">
              <strong>T & C :</strong><br />
              1. CHEQUE TO BE ISSUE FAVOUR OF M/S SIDDESH LOGISTICS<br />
              2. INTEREST BE CHARGES ON OVER DUE BILLS<br />
              3. SERVICE CHARGES PAID BY CONSIGNER/ PARTY<br />
              4. PAN NO : - MZ5PG4863G
            </div>
            <div className="signature-section">
              <img 
                src="/signature.png" 
                alt="Signature" 
                className="signature-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.log('Signature image failed to load');
                }}
                onLoad={() => console.log('Signature image loaded successfully')}
              />
              <strong>SIDDESH LOGISTICS</strong>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
