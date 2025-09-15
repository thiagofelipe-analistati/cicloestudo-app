// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { DashboardPage } from "../pages/DashboardPage.tsx";
import { DisciplinasPage } from "../pages/DisciplinasPage.tsx";
import { HistoricoPage } from "../pages/HistoricoPage.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

export const router = createBrowserRouter([
  // Rotas públicas
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // Rotas privadas
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "disciplinas", element: <DisciplinasPage /> },
          { path: "historico", element: <HistoricoPage /> },
        ],
      },
    ]
  },
]);