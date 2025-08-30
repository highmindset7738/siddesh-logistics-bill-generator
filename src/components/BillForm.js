import React, { useState, useEffect, useCallback } from 'react';

const BillForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  // Generate unique bill number
  const generateBillNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const time = now.getTime().toString().slice(-4);
    return `SL/${day}${month}${year}/${time}`;
  };

  const calculateTotals = useCallback(() => {
    const totalAmount = formData.shipments.reduce((sum, shipment) => {
      return sum + (parseFloat(shipment.total) || 0);
    }, 0);
    
    const balanceAmount = totalAmount - (parseFloat(formData.advanceAmount) || 0);
    
    setFormData(prev => ({
      ...prev,
      totalAmount,
      balanceAmount
    }));
  }, [formData.shipments, formData.advanceAmount]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Auto-generate bill number on component mount
  useEffect(() => {
    if (!formData.billNo) {
      setFormData(prev => ({
        ...prev,
        billNo: generateBillNumber()
      }));
    }
  }, [formData.billNo]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fillDummyData = () => {
    const dummyData = {
      billNo: generateBillNumber(), // Use the generateBillNumber function
      date: new Date().toISOString().split('T')[0],
      customerName: 'ABC Industries Pvt Ltd',
      customerAddress: '123 Industrial Area, Sector 15, Gurgaon, Haryana - 122001',
      shipments: [
        {
          srNo: 1,
          date: new Date().toISOString().split('T')[0],
          containerNo: 'TCLU' + Math.floor(Math.random() * 1000000),
          vehicleNo: 'HR-26-' + Math.floor(Math.random() * 10000),
          from: 'Mumbai Port',
          to: 'Delhi ICD',
          weight: '25.5',
          totalFair: '15000',
          total: '15000'
        }
      ],
      advanceAmount: 5000,
      totalAmount: 15000,
      balanceAmount: 10000
    };
    
    setFormData(dummyData);
  };

  const handleShipmentChange = (index, field, value) => {
    const updatedShipments = [...formData.shipments];
    updatedShipments[index] = {
      ...updatedShipments[index],
      [field]: value
    };

    // Auto-calculate total if totalFair changes
    if (field === 'totalFair') {
      updatedShipments[index].total = value;
    }

    setFormData(prev => ({
      ...prev,
      shipments: updatedShipments
    }));
  };

  const addShipment = () => {
    const newShipment = {
      srNo: formData.shipments.length + 1,
      date: '',
      containerNo: '',
      vehicleNo: '',
      from: '',
      to: '',
      weight: '',
      totalFair: '',
      total: ''
    };

    setFormData(prev => ({
      ...prev,
      shipments: [...prev.shipments, newShipment]
    }));
  };

  const removeShipment = (index) => {
    if (formData.shipments.length > 1) {
      const updatedShipments = formData.shipments.filter((_, i) => i !== index);
      // Renumber the shipments
      const renumberedShipments = updatedShipments.map((shipment, i) => ({
        ...shipment,
        srNo: i + 1
      }));

      setFormData(prev => ({
        ...prev,
        shipments: renumberedShipments
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a fresh bill number for each bill submission
    const freshBillData = {
      ...formData,
      billNo: generateBillNumber()
    };
    
    // Update the form with the new bill number
    setFormData(freshBillData);
    
    // Submit with the fresh bill number
    onSubmit(freshBillData);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        {/* Bill Information */}
        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>📋 Bill Information</h3>
            <button 
              type="button" 
              onClick={fillDummyData}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
               Fill Test Data
            </button>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Bill Number *</label>
              <input
                type="text"
                value={formData.billNo}
                onChange={(e) => handleInputChange('billNo', e.target.value)}
                placeholder="e.g., 116/25-26"
                required
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="form-section">
          <h3>👤 Customer Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="e.g., ABC TRADING COMPANY"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Customer Address *</label>
              <textarea
                value={formData.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                placeholder="Enter complete address"
                required
              />
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="form-section">
          <h3>🚛 Shipment Details</h3>
          {formData.shipments.map((shipment, index) => (
            <div key={index} className="shipment-item">
              <div className="shipment-header">
                <h4>Shipment #{shipment.srNo}</h4>
                {formData.shipments.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeShipment(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={shipment.date}
                    onChange={(e) => handleShipmentChange(index, 'date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Container No *</label>
                  <input
                    type="text"
                    value={shipment.containerNo}
                    onChange={(e) => handleShipmentChange(index, 'containerNo', e.target.value)}
                    placeholder="e.g., ABCD1234567"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vehicle No *</label>
                  <input
                    type="text"
                    value={shipment.vehicleNo}
                    onChange={(e) => handleShipmentChange(index, 'vehicleNo', e.target.value)}
                    placeholder="e.g., MH-04-AB-1234"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Location *</label>
                  <input
                    type="text"
                    value={shipment.from}
                    onChange={(e) => handleShipmentChange(index, 'from', e.target.value)}
                    placeholder="e.g., MUMBAI"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To Location *</label>
                  <input
                    type="text"
                    value={shipment.to}
                    onChange={(e) => handleShipmentChange(index, 'to', e.target.value)}
                    placeholder="e.g., PUNE"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="text"
                    value={shipment.weight}
                    onChange={(e) => handleShipmentChange(index, 'weight', e.target.value)}
                    placeholder="e.g., 15.5 MT"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Amount *</label>
                  <input
                    type="number"
                    value={shipment.totalFair}
                    onChange={(e) => handleShipmentChange(index, 'totalFair', e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={addShipment}
          >
            + Add Another Shipment
          </button>
        </div>

        {/* Payment Summary */}
        <div className="form-section">
          <h3>💰 Payment Summary</h3>
          <div className="summary-section">
            <div className="form-row">
              <div className="form-group">
                <label>Advance Amount</label>
                <input
                  type="number"
                  value={formData.advanceAmount}
                  onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                  placeholder="Enter advance amount"
                />
              </div>
            </div>
            
            <div className="summary-row">
              <span>Total Amount:</span>
              <span>₹{formData.totalAmount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Advance:</span>
              <span>₹{(formData.advanceAmount || 0).toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Balance:</span>
              <span>₹{formData.balanceAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            📄 Generate Bill
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;
