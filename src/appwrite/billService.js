import { databases, storage, DATABASE_ID, BILLS_COLLECTION_ID, SHIPMENTS_COLLECTION_ID, STORAGE_BUCKET_ID, ID } from './config';

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
                paidAmount: Number(billData.advanceAmount || 0),
                balanceAmount: Number(billData.balanceAmount || 0),
                userId: String('siddesh-user'),
                pdfFileId: String(''),
                pdfUrl: String(''),
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
                    weight: String(shipment.weight || ''),
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
                SHIPMENTS_COLLECTION_ID,
                [
                    `billId="${billId}"`
                ]
            );
            console.log('✅ Shipments fetched:', response.documents);
            return response.documents;
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
            await databases.deleteDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                billId
            );
            return true;
        } catch (error) {
            console.error('Error deleting bill:', error);
            throw error;
        }
    }
}

const billService = new BillService();
export default billService;
