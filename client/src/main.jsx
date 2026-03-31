import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { context } from "./context.js";
import { Navigate } from "react-router-dom";

const { authUser } = context();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: authUser ? <HomePage /> : <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: !authUser ? <LoginPage /> : <Navigate to="/" />,
      },
      {
        path: "/profile",
        element: authUser ? <ProfilePage /> : <Navigate to="/login" />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>,
);
