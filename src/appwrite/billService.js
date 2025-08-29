import { databases, storage, DATABASE_ID, BILLS_COLLECTION_ID, STORAGE_BUCKET_ID, ID } from './config';

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
            return document;
        } catch (error) {
            console.error('❌ APPWRITE ERROR:', error);
            console.error('Error response:', error.response);
            throw error;
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
