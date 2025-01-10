import logo from "../../../assets/images/logo.png";
import accountIcon from "../../../assets/images/account-icon.png";
import book from "../../../assets/images/literature-review.png";
import settings from "../../../assets/images/settings.png";

import SideLink from "./SideLink";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {  useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";

function Sidebar({ setPage }) {
  const [greeting, setGreeting] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  };

  // useEffect to update the greeting on component mount
  useEffect(() => {
    updateGreeting();
  }, []);
  // console.log(user);
  return (
    <aside className="side-dashboard">
      <div className="sidebar-container">
        <div className="welcome-container">
          <img src={logo} className="side-logo" />
          <div className="welcome-text">
            <h2>Welcome back!</h2>
            <h3>{greeting}, {user["firstName"]}!</h3>
          </div>
        </div>
        <div
          onClick={() => {
            setPage("profile");
            console.log(user);
          }}
        >
          <SideLink icon={accountIcon} labelText={"My Account"} />
        </div>
        <SideLink icon={book} labelText={"Contact Directory"} />
        <SideLink icon={settings} labelText={"Settings"} />
      </div>
      <button
        className="btn-blue btn-logout btn"
        onClick={async () => {
          var result = await Swal.fire({
            title: "Log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonColor: "No",
          });
          if (result.isConfirmed) {
            navigate("/");
            localStorage.clear();
          } else {
            return;
          }
          // clearModalRegister();
        }}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
