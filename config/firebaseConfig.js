import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const configuracoesFirebase = {
  apiKey: "AIzaSyDm0LM9EyVZJ2XYfWRZWGk3EF-9wUs7wUo",
  authDomain: "qualquer-tres.firebaseapp.com",
  projectId: "qualquer-tres",
  storageBucket: "qualquer-tres.firebasestorage.app",
  messagingSenderId: "365336328307",
  appId: "1:365336328307:web:286a5fc96412b38a939206",
  measurementId: "G-T7CW8F339V",
};

const app = initializeApp(configuracoesFirebase);
export const autenticacao = getAuth(app);
