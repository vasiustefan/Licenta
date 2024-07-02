import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import router from "./router.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { RouterProvider } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import "./CSS/Main.scss";

const firebaseConfig = {
  apiKey: "AIzaSyAlfRooEZ-AR9UJRi8mLpTAOKDo3-rnFAA",
  authDomain: "licenta-7864b.firebaseapp.com",
  projectId: "licenta-7864b",
  storageBucket: "licenta-7864b.appspot.com",
  messagingSenderId: "414614077179",
  appId: "1:414614077179:web:dc650b490cdd15c4e53a5e",
  measurementId: "G-X5VNFC8K95",
};

const firebaseConfigTest = {
  apiKey: "AIzaSyA1gNceo1Wl4kMPmZHP7Oj-MwhGClTmsJQ",
  authDomain: "test-licenta-edc31.firebaseapp.com",
  projectId: "test-licenta-edc31",
  storageBucket: "test-licenta-edc31.appspot.com",
  messagingSenderId: "403393777974",
  appId: "1:403393777974:web:cf5aa35f00b648e5a0e397",
  measurementId: "G-Z5BENQ7Z5V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfigTest);
const db = getFirestore(app);
const auth = getAuth(app);
export { app, auth, db };

export const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Suspense fallback={<React.Fragment />}>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </React.StrictMode>
  );
};
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
