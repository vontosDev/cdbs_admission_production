import logo from "../../assets/images/logo.png";

function Verification() {
  return (
    <div className="verification-container">
      <div className="verification-box">
        <img src={logo} className="logo-verification" />
        <h1>Please verify your email</h1>
        <h3>Please check the email that we sent to:</h3>
        <h2>miguel.alviar45@gmail.com</h2>

        <p className="verification-para">
          Please click on the verification link in the email to verify your
          account.
        </p>
        <p className="verification-para ver-blue">
          Didn't receive an email? Click "resend email verification".
        </p>
        <hr />
        <button className="btn btn-blue">Resend email verification</button>
      </div>
    </div>
  );
}

export default Verification;
