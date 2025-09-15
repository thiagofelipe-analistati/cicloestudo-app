// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { DashboardPage } from "../pages/DashboardPage.tsx";
import { DisciplinasPage } from "../pages/DisciplinasPage.tsx";
import { HistoricoPage } from "../pages/HistoricoPage.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx"; // <-- 1. IMPORTE A PÁGINA DE REGISTRO
import { ProtectedRoute } from "./ProtectedRoute.tsx";

const router = createBrowserRouter([
  // Rotas públicas (não protegidas)
  {
    path: "/login",
    element: <LoginPage />,
  },
  { // <-- 2. ADICIONE A NOVA ROTA DE REGISTRO AQUI
    path: "/register",
    element: <RegisterPage />,
  },

  // Rotas privadas (protegidas)
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

export function AppRoutes() {
  return <RouterProvider router={router} />;
}