import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import "./App.css";
import "./queries.css";
import SignUp from "./pages/SignUp/SignUp";
import Registration from "./pages/Registration/Registration";
import Profile from "./pages/Dashboard/components/Profile";
import { UserProvider } from "./context/UserContext.jsx";
import { jwtVerify, SignJWT } from "jose";
import { AdmissionsProvider } from "./context/AdmissionsContext.jsx";
import Verification from "./pages/Verification/Verification.jsx";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword.jsx";
import NewPassword from "./pages/ForgetPassword/pages/NewPassword.jsx";

function App() {
  const SECRET_KEY = new TextEncoder().encode("secret-123");

  const [admissions, setAdmissions] = useState({
    admissionsArr: [],
  });

  const [user, setUser] = useState({
    accountType: null,
    contactNo: null,
    admissions: [],
    emailAddress: null,
    firstName: null,
    middleName: null,
    lastName: null,
    isVerified: null,
    registryType: null,
  });

  const verifyToken = async (token) => {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY); // Use Uint8Array key
      console.log("Decoded Payload:", payload); // Decoded UserContext object
      return payload;
    } catch (error) {
      console.error("Invalid or expired token", error);
      return null;
    }
  };

  const handleSessionToken = async (sessionToken) => {
    const decodedUser = await verifyToken(sessionToken);
    console.log(decodedUser);
    setUser(decodedUser);
  };

  useEffect(() => {
    var sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken != null) {
      handleSessionToken(sessionToken);
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser }}>
      <AdmissionsProvider value={{ admissions, setAdmissions }}>
        <Router basename="/">
          <Routes>
            <Route path="/forget/change-pass" element={<NewPassword />} />
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/register/learner"
              element={<Registration typeRegister={"learner"} />}
            />
            <Route
              path="/register/parent"
              element={<Registration typeRegister={"parent"} />}
            />
            <Route
              path="/register/guardian"
              element={<Registration typeRegister={"guardian"} />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/forget" element={<ForgetPassword />} />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </AdmissionsProvider>
    </UserProvider>
  );
}

export default App;
