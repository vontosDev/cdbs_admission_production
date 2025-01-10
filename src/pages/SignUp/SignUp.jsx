import { useState } from "react";
import logo from "../../assets/images/logo.png";
import { Navigate, useNavigate } from "react-router-dom";

function SignUp() {
  const [selection, setSelection] = useState("parent");
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    contact_no: "",
    email: "",
    password: "",
    birthday: "",
    registry_type: "",
  });

  const navigate = useNavigate();
  return (
    <div className="login-container">
      <div className="login-section login-box">
        <img src={logo} className="logo" />
        <div className="sign-up-container">
          <h3>Get Started</h3>
          {/*<h4 className="subtext">
            Please choose <span>Account Type</span>
          </h4>
          <div className="sign-up-text">
            <span>Account Type*</span>

            <div
              className={`sign-up-btns ${
                selection == "learner" ? "selected" : ""
              }`}
              onClick={() => setSelection("learner")}
            >
              Learner
            </div>
            <div
              className={`sign-up-btns ${
                selection == "parent" ? "selected" : ""
              }`}
              onClick={() => setSelection("parent")}
            >
              Parent
            </div>
            <div
              className={`sign-up-btns ${
                selection == "guardian" ? "selected" : ""
              }`}
              onClick={() => setSelection("guardian")}
            >
              Guardian
            </div>
          </div>*/}
          <div className="btn-container create-btn">
            <button
              className={`btn ${selection == "" ? "btn-grey" : "btn-blue"}`}
              onClick={() => {
                if (selection == "") {
                  return;
                }
                navigate(`/register/${selection}`);
              }}
            >
              Register
            </button>
          </div>
          <p className="footer-text">
            By Signing Up, you agree to our{" "}
            <span className="link-blue">Privacy Policy</span> and{" "}
            <span className="link-blue">Terms and Conditions</span>
          </p>
        </div>
        {/* <div className="btn-container">
          <button
            className="btn btn-blue"
            onClick={() => navigate("/dashboard")}
          >
            Log In
          </button>
          <button
            className="btn btn-signup"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default SignUp;
