import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAw-xIi52C5zqAlABRnaQLVEjwiQCOX8JU",
  authDomain: "mechat-1e525.firebaseapp.com",
  projectId: "mechat-1e525",
  storageBucket: "mechat-1e525.appspot.com",
  messagingSenderId: "883401914203",
  appId: "1:883401914203:web:477201abec4e32e5d94c7e",
  measurementId: "G-Z46718J0JX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const FOLDER_NAME = '/medias'

export default app;
export const storage = getStorage(app);

const upload = (media) => {
    const mediaRef = ref(storage, `${FOLDER_NAME}/${Date.now().toString()}-${media?.name?.replace(/[ \t]+/g, '') || 'name-'+ Date.now()}`)
    return uploadBytes(mediaRef, media).then(snapshot => getDownloadURL(snapshot.ref));
}

export const uploadToFirebase = (medias) => {
  if (medias.length === 0) return Promise.resolve([]);
    const fileUploads = medias.map(media => upload(media))
    const urlPromises = Promise.all(fileUploads)
    return urlPromises;
}