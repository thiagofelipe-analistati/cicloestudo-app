// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { DashboardPage } from "../pages/DashboardPage.tsx";
import { DisciplinasPage } from "../pages/DisciplinasPage.tsx";
import { HistoricoPage } from "../pages/HistoricoPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: "/disciplinas", 
        element: <DisciplinasPage />,
      },
      {
        path: "/historico", 
        element: <HistoricoPage />,
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}