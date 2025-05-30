// src/routes/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../helpers/tokenValidator";


interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem("authToken");

  if (!isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
