// src/config/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDpkALdA5A_3Xa5-P7_CLb161eAcF9IN7A",
  authDomain: "hackathonfiap-82f44.firebaseapp.com",
  projectId: "hackathonfiap-82f44",
  storageBucket: "hackathonfiap-82f44.firebasestorage.app",
  messagingSenderId: "624135001978",
  appId: "1:624135001978:web:eb22800016ef45ebdd28c3",
  measurementId: "G-L2WB2C5KDM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);