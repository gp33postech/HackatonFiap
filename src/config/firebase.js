
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração temporária para desenvolvimento - SUBSTITUA pelos valores reais do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDummy-key-for-development-replace-with-real",
  authDomain: "hackaton-fiap-dev.firebaseapp.com",
  projectId: "hackaton-fiap-dev",
  storageBucket: "hackaton-fiap-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345",
};

// Inicialize o Firebase App
const app = initializeApp(firebaseConfig);

// Para desenvolvimento, usar getAuth simples para evitar erros de persistência
const auth = getAuth(app);

export { app, auth };
