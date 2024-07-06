import { createBrowserRouter } from "react-router-dom";
import { Eroare } from "./components/Eroare";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import ListaTure from "./pages/ListaTure";
import Tura from "./pages/Tura";
import AdaugaTure from "./pages/AdaugaTure";
import ContulMeu from "./pages/ContulMeu";
import EditareProfil from "./pages/EditareProfil";

export const Routes = {
  Home: "/",
  ListaTure: "/ture",
  Tura: "/tura/:id",
  AdaugaTure: "/ture/adauga-ture",
  ContulMeu: "/contul-meu",
  EditareProfil: "/editare-profil",
  Eroare: "*",
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: Routes.Home,
        element: <Home />,
      },
      {
        path: Routes.ListaTure,
        element: <ListaTure />,
      },
      {
        path: Routes.Tura,
        element: <Tura />,
      },
      {
        path: Routes.AdaugaTure,
        element: <AdaugaTure />,
      },
      {
        path: Routes.ContulMeu,
        element: <ContulMeu />,
      },
      {
        path: Routes.EditareProfil,
        element: <EditareProfil />,
      },
    ],
  },
  {
    path: Routes.Eroare,
    element: <Eroare />,
  },
]);

export default router;
