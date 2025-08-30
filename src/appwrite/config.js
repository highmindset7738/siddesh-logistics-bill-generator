import { Client, Databases, Storage, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('654239676f5bbae9731d');

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = '68acb9500012dbf18017';
export const BILLS_COLLECTION_ID = '68acb9640015f6708c55';
export const SHIPMENTS_COLLECTION_ID = '68ad7f06000931ce57de';
export const PAYMENTS_COLLECTION_ID = 'payments';
export const STORAGE_BUCKET_ID = '68ad7b140014650c5f44';

export { ID };
