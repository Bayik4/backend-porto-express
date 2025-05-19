import admin from "firebase-admin";
// import serviceAccount from '../../serviceAccount.json';
import env from "dotenv";
env.config();

const serviceAccount = JSON.parse(
  Buffer.from(process.env.SERVICE_ACCOUNT_BASE64!, 'base64').toString("utf-8")
);

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount as ServiceAccount)
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
