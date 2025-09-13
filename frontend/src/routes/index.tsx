// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // O App.tsx é o elemento pai (layout)
    children: [
      {
        path: "/", // Quando a URL for a raiz
        element: <HomePage />, // Renderize a HomePage
      },
      
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}