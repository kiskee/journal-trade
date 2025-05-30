// src/routes/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../helpers/tokenValidator";


interface ProtectedRouteProps {
  element: JSX.Element;
}

const DesprotectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem("authToken");

  if (isTokenValid(token)) {
    return <Navigate to="/inicio" replace />;
  }

  return element;
};

export default DesprotectedRoute;
