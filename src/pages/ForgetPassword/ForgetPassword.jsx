import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://donboscoapi.vercel.app/api/admission/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
            "supabase-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      Swal.fire({
        title: "Reset password email sent",
        text: "Please view your email and click on the link to reset password.",
        icon: "success",
      });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email == "") {
            return;
          }
          handleForgetPassword();
        }}
      >
        <div className="login-section login-box">
          <img src={logo} className="logo" />
          <div className="forget-password-container">
            {" "}
            <h3>Forgot Password</h3>
            <h4>Please enter the email address linked to your account.</h4>
          </div>

          <label htmlFor="email">Email address:</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="text-field login-field form-control"
            required
            // readOnly={isLoading}
          />
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
            <button className="btn btn-blue">Forget password</button>
            <button
              className="btn btn-signup"
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </button>
            {/* {isLoading ? (
              <ReactLoading
                className="app-loader"
                type={"bubbles"}
                color="#012169"
              />
            ) : null} */}
          </div>
        </div>
      </form>
      {isLoading ? (
        <ReactLoading className="app-loader" type={"bubbles"} color="#012169" />
      ) : null}
    </div>
  );
}

export default ForgetPassword;
