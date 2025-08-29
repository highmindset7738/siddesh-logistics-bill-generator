import { databases, DATABASE_ID, BILLS_COLLECTION_ID, ID } from './config';

class BillService {
    async createBill(billData) {
        try {
            const document = await databases.createDocument(
                DATABASE_ID,
                BILLS_COLLECTION_ID,
                ID.unique(),
                {
                    billNumber: billData.billNo,
                    customerName: billData.customerName,
                    customerAddress: billData.customerAddress,
                    billDate: billData.date,
                    totalAmount: billData.totalAmount,
                    paidAmount: billData.advanceAmount || 0,
                    balanceAmount: billData.balanceAmount,
                    userId: 'siddesh-user', // Default user ID
                    pdfFileId: '', // Will be updated when PDF is generated
                    pdfUrl: '', // Will be updated when PDF is generated
                }
            );
            return document;
        } catch (error) {
            console.error('Error creating bill:', error);
            throw error;
        }
    }

    async getBills() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                BILLS_COLLECTION_ID
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching bills:', error);
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
