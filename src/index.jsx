import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import DashboardPage from "./DashboardPage";
import DashboardHomePage from "./DashboardHomePage";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import TablesPage from "./TablesPage";
import CustomersPage from "./CustomersPage";
import TransactionsPage from "./TransactionsPage";
import ReportsPage from "./ReportsPage";
import UsersPage from "./UsersPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/", // Halaman utama
    element: <App />,
  },
  {
    path: "/login", // Halaman login
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "tables", element: <TablesPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);