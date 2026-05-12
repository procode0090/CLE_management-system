



/**
 * Legacy Vite React App entrypoint preserved for reference.
 * The application has been converted to Next.js using src/pages routes
 * and src/pages/_app.tsx for global wrappers.
 */

/*
import React, { useState } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Components
import ScrollToTop from "./components/ScrollToTop";
import DemoSwitcher from "./components/DemoSwitcher";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import MainPage from "./pages/MainPage";
import ProductDetails from "./pages/ProductDetails";
import AdminGateway from "./adminpages/AdminGateway";
import AdminPanel from "./adminpages/AdminPanel";
import AdminDashboard from "./adminpages/AdminDashbaord"; // Matching your filename typo
import AddProducts from "./adminpages/AddProducts";
import SalesHistory from "./adminpages/SalesHistory";
import Inventory from "./adminpages/Inventory";
import CreateSaleSlip from "./adminpages/CreateSaleSlip";
import RepairDashboard from "./adminpages/RepairDashboard";
import AddRepairIntake from "./adminpages/AddRepairIntake";

// --- 1. DEFINE APPLAYOUT ---
// This component wraps your entire app to provide global UI elements
const AppLayout = ({ 
  switchStatus, 
  setSwitchStatus 
}: { 
  switchStatus: string; 
  setSwitchStatus: React.Dispatch<React.SetStateAction<string>> 
}) => {
  const switchfunc = () => {
    setSwitchStatus((prev: string) => (prev === "admin" ? "web" : "admin"));
  };

  return (
    <>
      <ScrollToTop />
      
      // The Outlet renders the current route's content
      <Outlet />

      // Global Demo Controls
      <div onClick={switchfunc} className="cursor-pointer">
        <DemoSwitcher currentMode={switchStatus} />
      </div>
      <WhatsAppButton />
    </>
  );
};

// --- 2. MAIN APP COMPONENT ---
function App() {
  const [switchStatus, setSwitchStatus] = useState<string>("web");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout switchStatus={switchStatus} setSwitchStatus={setSwitchStatus} />,
      children: [
        {
          index: true,
          // If admin mode is on, show the animated Gateway; otherwise, show the main site
          element: switchStatus === "admin" ? <AdminGateway /> : <MainPage />,
        },
        {
          path: "product/:id",
          element: <ProductDetails />,
        },
        // --- ADMIN NESTED ROUTES ---
        {
          path: "admin",
          element: <AdminPanel mode="inventory" />,
          children: [
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "add-product", element: <AddProducts /> },
            { path: "sales", element: <SalesHistory /> },
            { path: "inventory", element: <Inventory /> },
            { path: "saleslip", element: <CreateSaleSlip/> },
          ],
        },
        // --- REPAIR NESTED ROUTES ---
        {
          path: "repair-center",
          element: <AdminPanel mode="repairs" />,
          children: [
            { path: "repair", element: <RepairDashboard/> }, // Swap with Repair Dashboard when ready
            { path: "intake", element: <AddRepairIntake />},    // Swap with Repair Intake when ready
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
*/

const App = () => null;
export default App;




