import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCipqk6Wmi-Fjwf6u8GqnJGUS-2nn_uMRE',
  authDomain: 'algo-fpa.firebaseapp.com',
  databaseURL: 'https://algo-fpa-default-rtdb.firebaseio.com',
  projectId: 'algo-fpa',
  storageBucket: 'algo-fpa.appspot.com',
  messagingSenderId: '232113056886',
  appId: '1:232113056886:web:2c4fd6057ab01ee17d0357',
};
// Initialize Firebase

let app = null;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const DB = firebase.database();
export const StoreDB = firebase.firestore();
export const storage = firebase.storage();
export default firebase;
