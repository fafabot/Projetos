import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCa6Lok4m7hqC9FGo5oOHpG58WgcVVNx0o",
  authDomain: "keyforge-44aa4.firebaseapp.com",
  projectId: "keyforge-44aa4",
  storageBucket: "keyforge-44aa4.appspot.com",
  messagingSenderId: "678938817723",
  appId: "1:678938817723:web:149243ee01ec6b7d3ae59e"
};

const app = initializeApp(firebaseConfig);

export const autenticacao = getAuth(app);
export const bancoDados = getFirestore(app);
export const armazenamento = getStorage(app);

export default app;