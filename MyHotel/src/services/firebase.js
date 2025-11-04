import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZX8BVwb12__GQN-xkYC8MC-_Ib9lp2b4",
  authDomain: "myhotel-a6a43.firebaseapp.com",
  databaseURL: "https://myhotel-a6a43-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "myhotel-a6a43",
  storageBucket: "myhotel-a6a43.firebasestorage.app",
  messagingSenderId: "993085692573",
  appId: "1:993085692573:web:c891e9610bbe7536f59274",
  measurementId: "G-LDR4N9E4Y0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;