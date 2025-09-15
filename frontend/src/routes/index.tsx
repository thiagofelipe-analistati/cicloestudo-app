// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { DashboardPage } from "../pages/DashboardPage.tsx";
import { DisciplinasPage } from "../pages/DisciplinasPage.tsx";
import { HistoricoPage } from "../pages/HistoricoPage.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

// A variável 'router' agora é exportada diretamente
export const router = createBrowserRouter([
  // Rotas públicas (não protegidas)
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Rotas privadas (protegidas)
  {
    path: "/",
    element: <ProtectedRoute />, // O "segurança" fica aqui
    children: [
      {
        path: "/",
        element: <App />, // O App com o menu só é renderizado se o usuário estiver logado
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "disciplinas", element: <DisciplinasPage /> },
          { path: "historico", element: <HistoricoPage /> },
        ],
      },
    ]
  },
]);

// A função <AppRoutes /> foi removida, pois agora usamos o RouterProvider diretamente no main.tsx