import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useState, useEffect, useContext } from "react";
import hideEye from "../../assets/images/hideEye.png";
import showEye from "../../assets/images/showEye.svg";
import ReactLoading from "react-loading";
import UserContext from "../../context/UserContext";
import { jwtVerify, SignJWT } from "jose";
import { Modal } from "react-bootstrap";
import error from "../../assets/images/close.svg";

function Login() {
  const [showError, setShowError] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  var sessionToken = localStorage.getItem("sessionToken");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [tokenParam] = useSearchParams();

  const SECRET_KEY = new TextEncoder().encode("secret-123");

  const handleVerification = async (token) => {
    setIsLoading(() => true);
    console.log("VERIFYING");
    try {
      const response = await fetch(
        `https://donboscoapi.vercel.app/api/admission/verify_email?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
            "supabase-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
          },
        }
      );

      console.log(`RESPONSEBODY: ${response.body}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // alert("Verification successful!");
    } catch (error) {
      console.log(error);
      console.error("Error during login:", error);
      // alert("Login failed!");
    }
    setIsLoading(() => false);
  };

  const handleLogin = async () => {
    setIsLoading(() => true);
    try {
      const response = await fetch(
        "https://donboscoapi.vercel.app/api/admission/login_account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
            "supabase-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        var res = await response.json();
        throw new Error(`${res.error}`);
      }

      const data = await response.json();
      console.log(`LOGIN :${JSON.stringify(data["user"])}`);
      console.log(`HELLO: ${data["user"]["account_type"]}`);
      // console.log("Registration successful:", data);

      var userData = {
        userId: data["user"]["user_id"],
        accountType: data["user"]["account_type"],
        contactNo: data["user"]["contact_no"],
        admissions: data["user"]["db_admission_table"],
        emailAddress: data["user"]["email_address"],
        firstName: data["user"]["first_name"],
        middleName: data["user"]["middle_name"],
        lastName: data["user"]["last_name"],
        isVerified: data["user"]["is_verified"],
        registryType: data["user"]["registry_type"],
      };

      setUser(userData);
      await createToken(userData);
      console.log("Registration successful:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.message == "Invalid password") {
        setShowError(true);
      } else if (error.message == "Account not yet verified") {
        setVerificationError(true);
      } else {
        setShowError(true);
      }
    }
    setIsLoading(() => false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(e.target);
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const navigate = useNavigate();

  const createToken = async (dataObj) => {
    const token = await new SignJWT(dataObj)
      .setProtectedHeader({
        alg: "HS256",
      })
      .sign(SECRET_KEY);

    localStorage.setItem("userId", dataObj["userId"]);
    localStorage.setItem("sessionToken", token);
  };

  const handleSessionToken = async () => {
    const decodedUser = await verifyToken(sessionToken);
    console.log(decodedUser);
    setUser(decodedUser);
  };

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

  useEffect(() => {
    console.log(`Token: ${tokenParam.get("token")}`);
    // if (token != null) {

    // }
    var token = tokenParam.get("token");
    handleVerification(token);

    if (sessionToken != null) {
      handleSessionToken();
    }
  }, []);

  // console.log(`SESSION: ${sessionToken}`);
  return (
    <>
      <Modal show={verificationError} id="modal-container" centered>
        {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="verification-box">
            <img src={logo} className="logo-verification" />
            <h1>Please verify your email</h1>
            <h3>Please check the email that we sent to:</h3>
            <h2>{formData.email}</h2>

            <p className="verification-para">
              Please click on the verification link in the email to verify your
              account and to continue with this email.
            </p>
            <p className="verification-para ver-blue">
              Didn't receive an email? Click "resend email verification"
            </p>
            <hr />
            <button onClick={handleVerification} className="btn btn-blue">
              Resend email verification
            </button>
            <button
              className="btn btn-grey"
              onClick={() => setVerificationError(false)}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showError} id="modal-container" centered>
        {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="dialog-box">
            <img src={error} className="logo-verification" />
            <h1>Invalid password!</h1>
            <h3>Please check your password and try again.</h3>

            <button
              className="btn btn-blue"
              onClick={() => setShowError(false)}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {sessionToken ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <div className="login-container">
          <form
            onSubmit={(e) => {
              if (isLoading) {
                return;
              }
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="login-section login-box">
              <img src={logo} className="logo" />
              <label htmlFor="email">Email address:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="text-field login-field form-control"
                required
                readOnly={isLoading}
              />
              {/* <div className="password-label">
          <label htmlFor="password">Password:</label>
        </div> */}
              <div id="email" className="form-row password-label ">
                <div className="form-col">
                  <label htmlFor="password" className="label-form">
                    Password*
                  </label>
                  <div className="input-with-icon">
                    <input
                      value={formData.password}
                      onChange={handleChange}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="form-textfield third-occ form-control"
                      placeholder="Password"
                      required
                      readOnly={isLoading}
                    />
                    <span
                      className="password-icon"
                      onClick={togglePasswordVisibility}
                      role="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <img src={showEye} />
                      ) : (
                        <img src={hideEye} />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <span
                onClick={() => {
                  navigate("/forget");
                }}
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
              </span>
              <div className="btn-container">
                <button className="btn btn-blue">Log In</button>
                <button
                  className="btn btn-signup"
                  onClick={() => {
                    if (isLoading) {
                      return;
                    }
                    navigate("/sign-up");
                  }}
                >
                  Sign Up
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
      )}
    </>
  );
}

export default Login;
