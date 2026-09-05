import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense, useEffect, useCallback } from "react";
import { HelmetProvider } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import WelcomeScreen from "./Pages/WelcomeScreen";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const ThankYouPage = lazy(() => import("./Pages/ThankYou"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const LandingPage = ({ showWelcome, onWelcomeComplete }) => {
  return (
    <>
      {/*
        Cover only — Home / Navbar are already painted underneath.
        When the timer fires this unmounts immediately. No AnimatePresence,
        so nothing can stall and leave a dark overlay on top of the page.
      */}
      {showWelcome && (
        <WelcomeScreen onLoadingComplete={onWelcomeComplete} />
      )}

      <Navbar />
      <Home />
      <About />
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Portofolio />
          <ContactPage />
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Single global AOS initialisation — all components call AOS.refresh() only
  useEffect(() => {
    AOS.init({ once: true, offset: 10, duration: 800, easing: "ease-out-cubic" });

    // AOS tags every element it processes with .aos-init. If it never
    // initialises (its own init bails when startEvent has already fired) its
    // stylesheet leaves every [data-aos] element stuck at opacity:0 forever,
    // blanking whole sections. Detect that and fall back to static content.
    const watchdog = setTimeout(() => {
      const hasAosMarkup = document.querySelector("[data-aos]");
      const aosInitialised = document.querySelector("[data-aos].aos-init");
      if (hasAosMarkup && !aosInitialised) {
        document.documentElement.classList.add("aos-failed");
      }
    }, 1200);

    return () => clearTimeout(watchdog);
  }, []);

  // Stable identity: WelcomeScreen's timer effect depends on this prop, so a
  // new function on every render would clear and restart the 3.4s countdown.
  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
    requestAnimationFrame(() => AOS.refreshHard());
  }, []);

  return (
    <HelmetProvider>
      <div className="pointer-events-none">
        <AnimatedBackground />
      </div>

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <LandingPage
                showWelcome={showWelcome}
                onWelcomeComplete={handleWelcomeComplete}
              />
            }
          />

          <Route path="/project/:slug" element={<ProjectPageLayout />} />

          <Route
            path="/thank-you"
            element={
              <Suspense fallback={null}>
                <ThankYouPage />
              </Suspense>
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />

          {/* ADMIN (PROTECTED) */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
