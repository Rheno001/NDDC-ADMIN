import "react-datepicker/dist/react-datepicker.css";
import "nouislider/distribute/nouislider.css";
import "ckeditor5/ckeditor5.css";
import "./assets/css/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Fragment, Suspense, useContext, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

import Index from "./jsx/Index";

import Login from "./jsx/pages/Login";
import { ThemeContext } from "./context/ThemeContext";



function App() {
  const { auth, setAuth } = useContext(ThemeContext);
  const navigate = useNavigate();

  function resizeHandler() {
    if (window.innerWidth <= 775) {
      document.body.setAttribute("data-sidebar-style", "overlay");
    } else {
      if (window.innerWidth >= 1024) {
        document.body.setAttribute("data-sidebar-style", "full");
      } else {
        document.body.setAttribute("data-sidebar-style", "mini");
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      resizeHandler();
    }, 100);
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Check authentication and handle navigation
  useEffect(() => {
    if (!auth?.username || !auth?.accessToken) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  if (auth?.username && auth?.accessToken) {
    return (
      <Fragment>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <Index />
        </Suspense>
        <ToastContainer />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <div className="vh-100">
          <Suspense
            fallback={
              <div id="preloader">
                <div className="sk-three-bounce">
                  <div className="sk-child sk-bounce1"></div>
                  <div className="sk-child sk-bounce2"></div>
                  <div className="sk-child sk-bounce3"></div>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/login" element={<Login setAuth={setAuth} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </div>
        <ToastContainer />
      </Fragment>
    );
  }
}

export default App;