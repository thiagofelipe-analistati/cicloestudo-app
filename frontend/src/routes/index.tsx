// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { DashboardPage } from "../pages/DashboardPage.tsx";   // <-- Adicione .tsx
import { DisciplinasPage } from "../pages/DisciplinasPage.tsx"; // <-- Adicione .tsx

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
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}