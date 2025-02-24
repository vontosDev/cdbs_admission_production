import logo from "../../assets/images/logo.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import hideEye from "../../assets/images/hideEye.png";
import showEye from "../../assets/images/showEye.svg";
import ReactLoading from "react-loading";
import { Button, Form, Modal } from "react-bootstrap";

function Registration({ typeRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTicked, setIsTicked] = useState(false);
  const [guardianSelect, setGuardianSelect] = useState("");
  const [parentSelect, setParentSelect] = useState("");
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  var sessionToken = localStorage.getItem("sessionToken");

  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    contact_no: "",
    email: "",
    relationship: "",
    other: "",
    password: "",
    c_password: "",
    birthday: "",
    registry_type: `${typeRegister}`,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async () => {
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/send_verification_code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          email_address: formData.email,
        }),
      }
    );
  };

  const handleRegistration = async () => {
    if (formData.c_password !== formData.password) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(() => true);
    try {
      const response = await fetch(
        "https://donboscoapi.vercel.app/api/admission/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
            "supabase-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
          },
          body: JSON.stringify({
            fname: formData.fname,
            mname: formData.mname,
            lname: formData.lname,
            contact_no: formData.contact_no,
            email: formData.email,
            user_relationship:
              formData.relationship == "Other"
                ? formData.other
                : formData.relationship,
            password: formData.password,
            birthday: formData.birthday,
            registry_type: `${typeRegister}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      // alert("Registration successful!");
      setShowModal(true);
      // navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed!");
    }
    setIsLoading(() => false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(e.target);
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const navigate = useNavigate();
  const renderContent = () => {
    switch (typeRegister) {
      case "learner":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isTicked) {
                handleRegistration();
              }
            }}
          >
            <div className="register-container">
              <h3>Get Started</h3>
              <h4>
                Please enter <span>Learner Information</span>
              </h4>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Full Name*
                  </label>
                  <input
                    id="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="Family Name"
                    required
                  />
                </div>
                <div className="form-col">
                  <p className="label-form colorless">Full Name*</p>
                  <input
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="First Name"
                    id="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-col">
                  <p className="label-form colorless">. </p>
                  <input
                    type="text"
                    id="mname"
                    value={formData.mname}
                    onChange={handleChange}
                    className="form-textfield third-occ form-control"
                    placeholder="Middle Name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Email*
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-textfield third-occ form-control"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Phone Number*
                  </label>
                  <input
                    maxLength={11}
                    id="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Date of Birth*
                  </label>
                  <input
                    max={today}
                    id="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    type="date"
                    className="form-textfield third-occ form-control"
                    required
                  />
                </div>
              </div>
              {/* <div className="form-row mt-4 mb-0">
                <div className="form-col">
                 
                </div>
              </div> */}

              {/* <div className="form-row">
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
              </div> */}
              <div className="form-row">
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
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="cpassword" className="label-form">
                    Confirm Password*
                  </label>
                  <div className="input-with-icon">
                    <input
                      value={formData.c_password}
                      onChange={handleChange}
                      id="c_password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-textfield third-occ form-control"
                      placeholder="Password"
                    />
                    <span
                      className="password-icon"
                      onClick={toggleConfirmPasswordVisibility}
                      role="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <img src={showEye} />
                      ) : (
                        <img src={hideEye} />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <p className="footer-text">
                <span style={{ textDecoration: "underline" }}>
                  Data Privacy Agreement
                </span>
                <br></br>
                <span
                  style={{
                    display: "block",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  By registering for admission to Caritas Don Bosco School, I
                  acknowledge that I have read and understood the school's
                  Privacy Policy. I consent to the collection, storage, and
                  processing of my personal data provided in this form for the
                  purpose of school registration and related administrative
                  activities in accordance with applicable data protection laws.
                </span>
                <br></br>

                <label htmlFor="register-data-priv">
                  <input
                    id="register-data-priv"
                    type="checkbox"
                    value={isTicked}
                    onChange={() => setIsTicked((prev) => !prev)}
                  />
                  {"  "}I understand that my personal information will be used
                  solely for school-related purposes and will not be shared with
                  third parties without my consent, except as required by law.
                </label>
              </p>
              <div className="btn-container create-btn">
                <button
                  className={`btn ${isTicked ? "btn-blue" : "btn-grey"}`}
                  // onClick={() => {}}
                >
                  Create Account
                </button>
                <p className="footer-text">
                  By signing up, you represent that you have read, fully
                  understood, and agree to our
                  <span className="link-blue"> Privacy Policy</span> and{" "}
                  <span className="link-blue">Terms and Conditions</span>
                </p>
              </div>
            </div>
          </form>
        );

      case "parent":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (isTicked) {
                handleRegistration();
              }
            }}
          >
            <div className="register-container">
              <h3>Get Started</h3>
              <h4>
                Please enter <span>Parent Information</span>
              </h4>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Full Name*
                  </label>
                  <input
                    id="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="Family Name"
                    required
                  />
                </div>
                <div className="form-col">
                  <p className="label-form colorless">Full Name*</p>
                  <input
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="First Name"
                    id="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-col">
                  <p className="label-form colorless">. </p>
                  <input
                    type="text"
                    id="mname"
                    value={formData.mname}
                    onChange={handleChange}
                    className="form-textfield third-occ form-control"
                    placeholder="Middle Name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Email*
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-textfield third-occ form-control"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Phone Number*
                  </label>
                  <input
                    maxLength={11}
                    id="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Date of Birth*
                  </label>
                  <input
                    id="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    type="date"
                    max={today}
                    className="form-textfield third-occ form-control"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="relationship" className="label-form">
                    Relationship to Learner*
                  </label>
                  <select
                    className="form-select"
                    id="relationship"
                    value={parentSelect}
                    onChange={(e) => {
                      setParentSelect(e.target.value);
                      handleChange(e);
                    }}
                  >
                    <option value="" disabled>
                      Please select relationship
                    </option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    {/* <option>Helo</option> */}
                  </select>
                </div>
              </div>
              <div className="form-row">
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
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="cpassword" className="label-form">
                    Confirm Password*
                  </label>
                  <div className="input-with-icon">
                    <input
                      value={formData.c_password}
                      onChange={handleChange}
                      id="c_password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-textfield third-occ form-control"
                      placeholder="Password"
                    />
                    <span
                      className="password-icon"
                      onClick={toggleConfirmPasswordVisibility}
                      role="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <img src={showEye} />
                      ) : (
                        <img src={hideEye} />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <p className="footer-text">
                <span style={{ textDecoration: "underline" }}>
                  Data Privacy Agreement
                </span>
                <br></br>
                <span
                  style={{
                    display: "block",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  By registering for admission to Caritas Don Bosco School, I
                  acknowledge that I have read and understood the school's
                  Privacy Policy. I consent to the collection, storage, and
                  processing of my personal data provided in this form for the
                  purpose of school registration and related administrative
                  activities in accordance with applicable data protection laws.
                </span>
                <br></br>

                <label htmlFor="register-data-priv">
                  <input
                    id="register-data-priv"
                    type="checkbox"
                    value={isTicked}
                    onChange={() => setIsTicked((prev) => !prev)}
                  />
                  {"  "}I understand that my personal information will be used
                  solely for school-related purposes and will not be shared with
                  third parties without my consent, except as required by law.
                </label>
              </p>

              <div className="btn-container create-btn">
                <button className={`btn ${isTicked ? "btn-blue" : "btn-grey"}`}>
                  Create Account
                </button>
                <p className="footer-text" style={{ marginBottom: "2rem" }}>
                  By signing up, you represent that you have read, fully
                  understood, and agree to our .
                  <span className="link-blue"> Privacy Policy</span> and{" "}
                  <span className="link-blue">Terms and Conditions</span>
                </p>
              </div>
            </div>
          </form>
        );

      case "guardian":
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (isTicked) {
                handleRegistration();
              }
            }}
          >
            <div className="register-container">
              <h3>Get Started</h3>
              <h4>
                Please enter <span>Guardian Information</span>
              </h4>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Full Name*
                  </label>
                  <input
                    id="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="Family Name"
                    required
                  />
                </div>
                <div className="form-col">
                  <p className="label-form colorless">Full Name*</p>
                  <input
                    type="text"
                    className="form-textfield third-occ form-control"
                    placeholder="First Name"
                    id="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-col">
                  <p className="label-form colorless">. </p>
                  <input
                    type="text"
                    id="mname"
                    value={formData.mname}
                    onChange={handleChange}
                    className="form-textfield third-occ form-control"
                    placeholder="Middle Name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Email*
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-textfield third-occ form-control"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Phone Number*
                  </label>
                  <input
                    maxLength={11}
                    id="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    type="phone"
                    className="form-textfield third-occ form-control"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Date of Birth*
                  </label>
                  <input
                    id="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    type="date"
                    className="form-textfield third-occ form-control"
                    max={today}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="name" className="label-form">
                    Relationship to Learner*
                  </label>
                  <select
                    className="form-select"
                    value={guardianSelect}
                    onChange={(event) => {
                      setGuardianSelect(event.target.value);
                      handleChange(event);
                    }}
                  >
                    <option value="" disabled>
                      Please select relationship
                    </option>
                    <option value={"Grandparent"}>Grandparent</option>
                    <option value={"Relative"}>Relative</option>
                    <option value={"Sibling"}>Sibling</option>
                    <option value={"Other"}>Other</option>
                  </select>
                </div>
                {guardianSelect == "Other" ? (
                  <div className="form-col">
                    <label htmlFor="other" className="label-form">
                      if Other*
                    </label>
                    <input
                      id="other"
                      value={formData.other}
                      onChange={handleChange}
                      type="text"
                      className="form-textfield third-occ form-control"
                      placeholder="Please specify"
                      required
                    />
                  </div>
                ) : null}
              </div>
              <div className="form-row">
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
              <div className="form-row">
                <div className="form-col">
                  <label htmlFor="cpassword" className="label-form">
                    Confirm Password*
                  </label>
                  <div className="input-with-icon">
                    <input
                      value={formData.c_password}
                      onChange={handleChange}
                      id="c_password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-textfield third-occ form-control"
                      placeholder="Password"
                    />
                    <span
                      className="password-icon"
                      onClick={toggleConfirmPasswordVisibility}
                      role="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <img src={showEye} />
                      ) : (
                        <img src={hideEye} />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="btn-container create-btn">
                <button className="btn btn-blue">Create Account</button>
                <p className="footer-text">
                  By signing up, you represent that you have read, fully
                  understood, and agree to our
                  <span className="link-blue"> Privacy Policy</span> and{" "}
                  <span className="link-blue">Terms and Conditions</span>
                </p>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <>
      <Modal show={showModal} id="modal-container" centered>
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
          </div>
        </Modal.Body>
      </Modal>
      {sessionToken ? <Navigate to="/dashboard" /> : null}
      <div className="login-container reg-con">
        <div className="login-section">
          <img src={logo} className="logo" />
          {renderContent()}
          {isLoading ? (
            <ReactLoading
              className="app-loader"
              type={"bubbles"}
              color="#012169"
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Registration;
