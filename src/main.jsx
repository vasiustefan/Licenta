import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import router from "./router.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { RouterProvider } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };

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
