import React from "react";

import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";


// AUTH
import { AuthProvider } from "./context/AuthContext";


// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";


// PAGES
import HomePage from "./pages/HomePage";

import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";

import Dashboard from "./pages/Dashboard";

import CreatePoll from "./pages/CreatePoll";

import MyPolls from "./pages/MyPolls";

import PublicPoll from "./pages/PublicPoll";

import AnalyticsPage from "./pages/AnalyticsPage";

import PublicResults from "./pages/PublicResults";


// ROUTER
const router = createBrowserRouter([

  // HOME
  {
    path: "/",
    element: <HomePage />,
  },

  // LOGIN
  {
    path: "/login",
    element: <LoginPage />,
  },

  // REGISTER
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // DASHBOARD
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  // CREATE POLL
  {
    path: "/create-poll",
    element: (
      <ProtectedRoute>
        <CreatePoll />
      </ProtectedRoute>
    ),
  },

  // MY POLLS
  {
    path: "/my-polls",
    element: (
      <ProtectedRoute>
        <MyPolls />
      </ProtectedRoute>
    ),
  },

  // PUBLIC POLL
  {
    path: "/poll/:id",
    element: <PublicPoll />,
  },

  // ANALYTICS
  {
    path: "/analytics/:pollId",
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
  },

  // PUBLIC RESULTS
  {
    path: "/results/:pollId",
    element: <PublicResults />,
  },

]);


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

  </React.StrictMode>
);