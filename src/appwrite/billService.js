import { databases, storage, DATABASE_ID, BILLS_COLLECTION_ID, SHIPMENTS_COLLECTION_ID, PAYMENTS_COLLECTION_ID, STORAGE_BUCKET_ID, ID } from './config';

class BillService {
    async createBill(billData) {
        try {
            console.log('🚀 Attempting to save bill to Appwrite...');
            console.log('📋 Bill data:', billData);
            
            const documentData = {
                billNumber: String(billData.billNo || ''),
                customerName: String(billData.customerName || ''),
                customerAddress: String(billData.customerAddress || ''),
                billDate: String(billData.date || ''),
                totalAmount: Number(billData.totalAmount || 0),
                paidAmount: Number(billData.advanceAmount || 0), // Keep for compatibility
                totalPaid: Number(billData.advanceAmount || 0), // New field for tracking
                balanceAmount: Number(billData.balanceAmount || 0),
                status: String(billData.balanceAmount === 0 ? 'paid' : 'pending'),
                userId: String('siddesh-user'),
            };
            
            console.log('📄 Document to create:', documentData);
            
            const document = await databases.createDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                ID.unique(),
                documentData
            );
            
            console.log('✅ SUCCESS! Bill saved to Appwrite:', document);
            
            // Save shipments to separate collection
            if (billData.shipments && billData.shipments.length > 0) {
                await this.saveShipments(document.$id, billData.shipments);
            }
            
            // Save initial payment record if advance amount > 0
            if (billData.advanceAmount > 0) {
                await this.savePaymentRecord(document.$id, billData.advanceAmount, 'Initial Advance Payment');
            }
            
            return document;
        } catch (error) {
            console.error('❌ APPWRITE ERROR:', error);
            console.error('Error response:', error.response);
            throw error;
        }
    }

    async saveShipments(billId, shipments) {
        try {
            console.log('🚢 Saving shipments for bill:', billId);
            
            for (const shipment of shipments) {
                const shipmentData = {
                    billId: String(billId),
                    srNo: Number(shipment.srNo || 0),
                    shipmentDate: String(shipment.date || ''),
                    containerNo: String(shipment.containerNo || ''),
                    vehicleNo: String(shipment.vehicleNo || ''),
                    fromLocation: String(shipment.from || ''),
                    toLocation: String(shipment.to || ''),
                    weight: Number(shipment.weight || 0),
                    totalFair: Number(shipment.totalFair || 0),
                };
                
                await databases.createDocument(
                    DATABASE_ID,
                    SHIPMENTS_COLLECTION_ID,
                    ID.unique(),
                    shipmentData
                );
            }
            
            console.log('✅ Shipments saved successfully');
        } catch (error) {
            console.error('❌ Error saving shipments:', error);
            throw error;
        }
    }

    async getShipments(billId) {
        try {
            console.log('🚢 Fetching shipments for bill:', billId);
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHIPMENTS_COLLECTION_ID
            );
            
            // Filter shipments for this bill ID
            const billShipments = response.documents.filter(shipment => shipment.billId === billId);
            
            console.log('✅ Shipments fetched:', billShipments);
            return billShipments;
        } catch (error) {
            console.error('❌ Error fetching shipments:', error);
            return [];
        }
    }

    async savePDFToStorage(pdfBlob, billNumber) {
        try {
            console.log('📁 Uploading PDF to storage...');
            
            const fileName = `${billNumber.replace(/\//g, '-')}.pdf`;
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
            
            const uploadedFile = await storage.createFile(
                STORAGE_BUCKET_ID,
                ID.unique(),
                file
            );
            
            console.log('✅ PDF uploaded successfully:', uploadedFile);
            
            // Get file URL
            const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id);
            
            return {
                fileId: uploadedFile.$id,
                fileUrl: fileUrl.href
            };
        } catch (error) {
            console.error('❌ Error uploading PDF:', error);
            throw error;
        }
    }

    async updateBillWithPDF(billId, pdfFileId, pdfUrl) {
        try {
            console.log('🔄 Updating bill with PDF info...');
            
            const updatedDocument = await databases.updateDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                billId,
                {
                    pdfFileId: pdfFileId,
                    pdfUrl: pdfUrl
                }
            );
            
            console.log('✅ Bill updated with PDF info:', updatedDocument);
            return updatedDocument;
        } catch (error) {
            console.error('❌ Error updating bill with PDF:', error);
            throw error;
        }
    }

    async getBills() {
        try {
            console.log('📋 Fetching bills from Appwrite...');
            const response = await databases.listDocuments(
                DATABASE_ID,
                BILLS_COLLECTION_ID
            );
            console.log('✅ Bills fetched:', response.documents);
            return response.documents;
        } catch (error) {
            console.error('❌ Error fetching bills:', error);
            throw error;
        }
    }

    async getBill(billId) {
        try {
            const document = await databases.getDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                billId
            );
            return document;
        } catch (error) {
            console.error('Error fetching bill:', error);
            throw error;
        }
    }

    async deleteBill(billId) {
        try {
            console.log('🗑️ Deleting bill and related data:', billId);
            
            // Delete all related shipments
            await this.deleteShipments(billId);
            
            // Delete all related payments
            await this.deletePayments(billId);
            
            // Delete the bill
            await databases.deleteDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                billId
            );
            
            console.log('✅ Bill, shipments, and payments deleted successfully');
            return true;
        } catch (error) {
            console.error('❌ Error deleting bill:', error);
            throw error;
        }
    }

    async deleteShipments(billId) {
        try {
            console.log('🚢 Deleting shipments for bill:', billId);
            
            // Get all shipments for this bill
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHIPMENTS_COLLECTION_ID
            );
            
            // Filter shipments for this bill and delete them
            const billShipments = response.documents.filter(shipment => shipment.billId === billId);
            
            for (const shipment of billShipments) {
                await databases.deleteDocument(
                    DATABASE_ID,
                    SHIPMENTS_COLLECTION_ID,
                    shipment.$id
                );
            }
            
            console.log(`✅ Deleted ${billShipments.length} shipments`);
        } catch (error) {
            console.error('❌ Error deleting shipments:', error);
            throw error;
        }
    }

    async addPayment(billId, paymentAmount) {
        try {
            console.log('💰 Adding payment:', paymentAmount, 'to bill:', billId);
            
            // Get current bill data
            const bill = await this.getBill(billId);
            const newTotalPaid = Number(bill.totalPaid) + Number(paymentAmount);
            const newBalance = Number(bill.totalAmount) - newTotalPaid;
            const newStatus = newBalance <= 0 ? 'paid' : 'pending';
            
            // Update bill
            const response = await databases.updateDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                billId,
                {
                    totalPaid: newTotalPaid,
                    balanceAmount: newBalance,
                    status: newStatus
                }
            );
            
            // Save payment record
            await this.savePaymentRecord(billId, paymentAmount, 'Additional Payment');
            
            console.log('✅ Payment added successfully');
            return response;
        } catch (error) {
            console.error('❌ Error adding payment:', error);
            throw error;
        }
    }

    async savePaymentRecord(billId, amount, description = '') {
        try {
            const now = new Date();
            const paymentData = {
                billId: String(billId),
                paymentAmount: Number(amount),
                paymentDate: now.toLocaleDateString('en-GB'),
                paymentTime: now.toLocaleTimeString('en-GB', { hour12: true }),
                description: String(description)
            };
            
            await databases.createDocument(
                DATABASE_ID,
                PAYMENTS_COLLECTION_ID,
                ID.unique(),
                paymentData
            );
            
            console.log('✅ Payment record saved');
        } catch (error) {
            console.error('❌ Error saving payment record:', error);
            throw error;
        }
    }

    async getPaymentHistory(billId) {
        try {
            console.log('📋 Fetching payment history for bill:', billId);
            const response = await databases.listDocuments(
                DATABASE_ID,
                PAYMENTS_COLLECTION_ID
            );
            
            const billPayments = response.documents.filter(payment => payment.billId === billId);
            console.log('✅ Payment history fetched:', billPayments);
            return billPayments;
        } catch (error) {
            console.error('❌ Error fetching payment history:', error);
            return [];
        }
    }

    async deletePayments(billId) {
        try {
            console.log('🗑️ Deleting payments for bill:', billId);
            
            const response = await databases.listDocuments(
                DATABASE_ID,
                PAYMENTS_COLLECTION_ID
            );
            
            const billPayments = response.documents.filter(payment => payment.billId === billId);
            
            for (const payment of billPayments) {
                await databases.deleteDocument(
                    DATABASE_ID,
                    PAYMENTS_COLLECTION_ID,
                    payment.$id
                );
            }
            
            console.log(`✅ Deleted ${billPayments.length} payment records`);
        } catch (error) {
            console.error('❌ Error deleting payments:', error);
            throw error;
        }
    }

    async updateBillStatus(billId, status) {
        try {
            console.log('📝 Updating bill status:', billId, 'to', status);
            
            const response = await databases.updateDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                billId,
                { status: String(status) }
            );
            
            console.log('✅ Bill status updated successfully');
            return response;
        } catch (error) {
            console.error('❌ Error updating bill status:', error);
            throw error;
        }
    }
}

const billService = new BillService();
export default billService;
