// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBINAq2GT8sTtoOpbxRAd9PIB6rOurj50k',
  authDomain: 'file-storage-c3276.firebaseapp.com',
  projectId: 'file-storage-c3276',
  storageBucket: 'file-storage-c3276.appspot.com',
  messagingSenderId: '315896573792',
  appId: '1:315896573792:web:4694645c8dcd5b73ecf805',
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
console.log(storage);
