import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import MainView from "./components/MainView";
import Sidebar from "./components/Sidebar";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { jwtVerify, SignJWT } from "jose";

function Dashboard() {
  const [page, setPage] = useState("main");
  const { setUser } = useContext(UserContext);
  const SECRET_KEY = new TextEncoder().encode("secret-123");

  var sessionToken = localStorage.getItem("sessionToken");

  const handleSessionToken = async (sessionToken) => {
    const decodedUser = await verifyToken(sessionToken);
    // console.log(decodedUser);
    setUser(decodedUser);
  };

  const verifyToken = async (token) => {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY); // Use Uint8Array key
      // console.log("Decoded Payload:", payload); // Decoded UserContext object
      return payload;
    } catch (error) {
      console.error("Invalid or expired token", error);
      return null;
    }
  };

  useEffect(() => {
    handleSessionToken(sessionToken);
  }, []);

  // if (!sessionToken) {
  //   console.log(`SESSION: ${sessionToken}`);
  //   return <Navigate to="/" replace />;
  // }

  // console.log(`SESSION: ${sessionToken}`);

  return (
    <>
      {sessionToken ? (
        <div className="dashboard-grid">
          <MainView setPage={setPage} page={page} />
          <Sidebar setPage={setPage} />
        </div>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
}

export default Dashboard;
