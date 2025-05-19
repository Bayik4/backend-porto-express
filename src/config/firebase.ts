import admin, { ServiceAccount } from 'firebase-admin';
// import serviceAccount from '../../serviceAccount.json';

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount as ServiceAccount)
  credential: JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT_BASE64!, 'base64').toString('utf-8'))
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth }