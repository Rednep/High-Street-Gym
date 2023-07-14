import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";
import { AuthenticationProvider } from "./hooks/authentication";
import { ProfileImageProvider } from "./contexts/ProfileImageContext";
import { BookingsProvider } from "./contexts/BookingsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthenticationProvider router={router}>
      <BookingsProvider>
        <ProfileImageProvider>
          <RouterProvider router={router} />
        </ProfileImageProvider>
      </BookingsProvider>
    </AuthenticationProvider>
  </React.StrictMode>
);
