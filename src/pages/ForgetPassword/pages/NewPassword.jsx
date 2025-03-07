import logo from "../../../assets/images/logo.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import hideEye from "../../../assets/images/hideEye.png";
import showEye from "../../../assets/images/showEye.svg";
import { Modal } from "react-bootstrap";
import error from "../../../assets/images/close.svg";
import Swal from "sweetalert2";

function NewPassword() {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tokenParam] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const token = tokenParam.get("token");

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleResetPassword = async (token) => {
    setIsLoading(true);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          token: token,
          password: password,
        }),
      }
    );
    if (response.status == 200) {
      await Swal.fire({
        title: "Password reset successfully",
        text: "Password has been confirmed and reset.",
        icon: "success",
      });
      navigate("/");
    }

    console.log(await response.json());
    setIsLoading(false);
  };

  return (
    <>
      <Modal show={showError} id="modal-container" centered>
        {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="dialog-box">
            <img src={error} className="logo-verification" />
            <h1>Passwords mismatch</h1>
            <h3>Please make sure your passwords match.</h3>

            <button
              className="btn btn-blue"
              onClick={() => setShowError(false)}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="login-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (cPassword != password) {
              setShowError(true);

              return;
            }
            handleResetPassword(token);
            // if (isLoading) {
            //   return;
            // }
          }}
        >
          <div className="login-section login-box">
            <img src={logo} className="logo" />
            <div className="forget-password-container">
              {" "}
              <h3>Change Password</h3>
              <h4>Please enter a new password for your account.</h4>
            </div>

            <label htmlFor="password">New Password:</label>
            <div className="input-with-icon" style={{ width: "40rem" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-textfield third-occ form-control"
                placeholder="Password"
                required
                readOnly={isLoading}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-icon"
                onClick={togglePasswordVisibility}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <img src={showEye} /> : <img src={hideEye} />}
              </span>
            </div>
            <label htmlFor="c_password" style={{ marginTop: "10px" }}>
              Confirm Password:
            </label>
            <div className="input-with-icon" style={{ width: "100%" }}>
              <input
                id="c_password"
                type={showPassword ? "text" : "password"}
                className="form-textfield third-occ form-control"
                placeholder="Password"
                required
                readOnly={isLoading}
                onChange={(e) => setCPassword(e.target.value)}
              />
              <span
                className="password-icon"
                onClick={togglePasswordVisibility}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <img src={showEye} /> : <img src={hideEye} />}
              </span>
            </div>
            {/* <div className="password-label">
          <label htmlFor="password">Password:</label>
        </div> */}

            {/* <span
            className="forget-password"
            style={{
              width: "100%",
              textAlign: "end",
              marginTop: "7px",
              fontSize: "1.1rem",
              textDecoration: "underline",
            }}
          >
            Forget Password?
          </span> */}
            <div className="btn-container">
              <button className="btn btn-blue">Change password</button>
              <button
                className="btn btn-signup"
                onClick={() => {
                  navigate("/");
                }}
              >
                Back
              </button>
              {isLoading ? (
                <ReactLoading
                  className="app-loader"
                  type={"bubbles"}
                  color="#012169"
                />
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewPassword;
