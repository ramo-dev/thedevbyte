import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { account } from "../src/firebase/firebase";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./routes/NotFound";
import Blogs from "./routes/Blogs";
import Profile from "../src/components/Profile/Profile";
import Loader from "./components/Loader/Loader";
import { storage } from "../src/firebase/firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
    const theme = localStorage.getItem("darkMode");
  useEffect(() => {

    theme === "true"
      ? (document.querySelector(".pre-Loader").style.background = "#111")
      : (document.querySelector(".pre-Loader").style.background = "#fff");
  }, []);

  useEffect(() => {
    const unsubscribe = account.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    console.log(account);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Blogs />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
