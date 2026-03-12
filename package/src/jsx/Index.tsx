import { useContext, useEffect, useState } from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout

import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
import WalletBar from "./layouts/WalletBar";
import Nav from "./layouts/nav";

/// Dashboard

import Home from "./components/Dashboard/Home";
import { ThemeContext } from "../context/ThemeContext";
import DashboardDark from "./components/Dashboard/DashboardDark";

//vendor

import Vendors from "./components/Vendor/Vendors";
import VendorDetails from "./components/Vendor/VendorDetails";
import AddNewVendor from "./components/Vendor/AddNewVendor";

//Roles
import Roles from "./components/Roles/Roles";
import AddRole from "./components/Roles/AddRole";
import Permissions from "./components/Roles/Permissions";
import AddPermission from "./components/Roles/AddPermission";

//bids
import Bids from "./components/Bids/Bids";





/// Pages

import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";

const Markup = () => {

  return (
    <>
      <Routes>
        <Route path="/page-error-400" element={<Error400 />} />
        <Route path="/page-error-403" element={<Error403 />} />
        <Route path="/page-error-404" element={<Error404 />} />
        <Route path="/page-error-500" element={<Error500 />} />
        <Route path="/page-error-503" element={<Error503 />} />
        <Route path="/page-lock-screen" element={<LockScreen />} />
        <Route element={<Layout1 />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard-dark" element={<DashboardDark />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendor-details" element={<VendorDetails />} />
          <Route path="/add-vendor" element={<AddNewVendor />} />
          <Route path="/edit-vendor" element={<AddNewVendor />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/add-role" element={<AddRole />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/add-permission" element={<AddPermission />} />
          <Route path="/bids" element={<Bids />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ScrollToTop />
    </>
  );
};

function Layout1() {
  const { openMenuToggle, iconhover } = useContext(ThemeContext);
  const { pathname } = useLocation();
  const showWalletBar = pathname === "/" || pathname === "/dashboard";

  const [width, setWidth] = useState<number>(0);
  const resizeHandler = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div
      id="main-wrapper"
      className={` show ${openMenuToggle && "menu-toggle"} ${iconhover ? "iconhover-toggle" : ""
        }`}
    >
      <div className={showWalletBar ? `wallet-open ${width > 1400 ? "active" : ""}` : ""}>
        <Nav />
        <div
          className="content-body"
          style={{ minHeight: window.screen.height + 20 }}
        >
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
        <Footer changeFooter="footer-outer" />
        {showWalletBar && <WalletBar />}
      </div>
    </div>
  );
}


export default Markup;
