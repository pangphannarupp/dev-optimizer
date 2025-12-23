import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object

const firebaseConfig = {
    apiKey: "AIzaSyCDXF2jm-a75tGnCCa81dAsYUeEvmimTp4",
    authDomain: "image-optimizer-26119.firebaseapp.com",
    projectId: "image-optimizer-26119",
    storageBucket: "image-optimizer-26119.firebasestorage.app",
    messagingSenderId: "599743440150",
    appId: "1:599743440150:web:fcfeb2396b9b890f981c37",
    measurementId: "G-DTZ02C1V41"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
