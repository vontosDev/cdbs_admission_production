import back from "../../../assets/images/back.png";
import ApplicantCard from "./ApplicantCard";
import wallet from "../../../assets/images/wallet.png";
// import card from "../../../assets/images/card.png";
import unionBank from "../../../assets/images/unionbank.jpeg";
import { Form, Modal } from "react-bootstrap";
import { useContext, useState } from "react";
import AdmissionsContext from "../../../context/AdmissionsContext";
import Swal from "sweetalert2";

function Payment({ setPage, dataIndex, applicationId, paymethodId }) {
  const [showModal, setShowModal] = useState(false);
  const { admissions } = useContext(AdmissionsContext);
  const [paymentId, setPaymentId] = useState("");
  const [referenceNo, setReferenceNo] = useState("");

  const handlePayment = async (paymentId) => {
    const response = await fetch(
      "https://dbs-api-live.vercel.app/api/admission/accept_agreement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://ligqdgmwtziqytxyqpvv.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ3FkZ213dHppcXl0eHlxcHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTE0MDQsImV4cCI6MjA1MjMyNzQwNH0.qHmECzoG1DfCs9zjirzwRzmp2V9OhBsKUr6tgnDCCq8",
        },
        body: JSON.stringify({
          admission_id: admissions["admissionsArr"][dataIndex]["admission_id"],
          payment_method: paymentId,
        }),
      }
    );
    console.log(await response.json());
  };

  const handleRefNo = async () => {
    const response = await fetch(
      "https://dbs-api-live.vercel.app/api/admission/accept_agreement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://ligqdgmwtziqytxyqpvv.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ3FkZ213dHppcXl0eHlxcHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NTE0MDQsImV4cCI6MjA1MjMyNzQwNH0.qHmECzoG1DfCs9zjirzwRzmp2V9OhBsKUr6tgnDCCq8",
        },
        body: JSON.stringify({
          admission_id: admissions["admissionsArr"][dataIndex]["admission_id"],
          reference_no: referenceNo,
        }),
      }
    );
    console.log(await response.json());

    if (response.status) {
      Swal.fire({
        title: "Reference No. Sent",
        text: "Please wait for your payment to be reviewed.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          setPage("main");
        }
      });
    }
  };

  return (
    <>
      <Modal
        show={showModal || paymethodId === 2 || paymethodId === 1}
        id="modal-container"
        centered
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="payment-box">
            <img
              src={paymethodId == 1 || paymentId == 1 ? wallet : unionBank}
              className="logo-verification"
            />
            <h1>
              {paymethodId == 1 || paymentId == 1
                ? "Payment Instructions for Admission Fee (Cash Payment)"
                : "Pay through UnionBank Bills Payment"}
            </h1>
            <h3 style={{ textAlign: "left" }}>
              {paymethodId == 1 || paymentId == 1
                ? "To complete the admission process, please follow these steps for cash payment:"
                : (
                  <>
                    1. Download the app through this link :&nbsp;
                    <a
                      href="https://www.unionbankph.com/unionbankonline/pay-bills"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      UnionBank 
                    </a>
                  </>
                )}
            </h3>
            <h3 style={{ textAlign: "left" }}>
              {paymethodId == 1 || paymentId == 1
                ? "1. Payment Location: Cashier, Caritas Don Bosco School Lobby"
                : "2. Once the UB account is created, go to ''Pay Bills'', ''Select Biller'', and search ''Caritas Don Bosco School''."}
            </h3>
            <h3 style={{ textAlign: "left" }}>
              {paymethodId == 1 || paymentId == 1
                ? "2. Payment Hours: Monday to Friday: 7:00 AM - 4:00; Saturday, 8:00AM - 12:00 PM."
                : "The account will be ready to use for any CDBS transaction."}
            </h3>
            <h3 style={{ textAlign: "left" }}>
              {paymethodId == 1 || paymentId == 1
                ? " 3. A receipt will be issued as proof of payment. Please keep it for reference."
                : "3. Once payment is made, kindly enter the reference number below."}
            </h3>
            <h3 style={{ textAlign: "left" }}>
              {paymethodId == 1 || paymentId == 1
                ? " 4. Sales Invoice number must be accomplished after payment at the cashier. "
                : "4. Sales Invoice number must be accomplished after payment. "}
            </h3>

            <hr className="payment-line" />
            {/* <h2>{formData.email}</h2> */}
            <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
              Please enter{" "}
              {paymethodId == 1 || paymentId == 1
                ? "Sales Invoice"
                : "Reference"}{" "}
              Number:
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "start",
              }}
            >
              <Form.Group controlId="refNo" style={{ flex: 1 }}>
                <Form.Control
                  type="text"
                  placeholder=" "
                  value={
                    admissions["admissionsArr"][dataIndex][
                      "db_admission_table"
                    ]["reference_no"] || referenceNo
                  }
                  onChange={(e) => setReferenceNo(e.target.value)}
                  required
                />
              </Form.Group>
              {admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "reference_no"
              ] === null ? (
                <button
                  type="button"
                  onClick={async () => {
                    if (referenceNo.length != 0) {
                      var result = await Swal.fire({
                        title: "Are you sure?",
                        text: `Please check if reference number is correct: ${referenceNo}`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonColor: "No",
                      });

                      if (result.isConfirmed) {
                        handlePayment(paymentId);
                        handleRefNo();
                        // return;
                      } else {
                        return;
                      }
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              ) : null}
            </div>

            <hr className="line-container" />
            <button
              className="btn btn-blue"
              onClick={() => {
                if (
                  admissions["admissionsArr"][dataIndex]["db_admission_table"][
                    "paymethod_id"
                  ] === 1 ||
                  admissions["admissionsArr"][dataIndex]["db_admission_table"][
                    "paymethod_id"
                  ] === 2
                ) {
                  setPage("main");
                } else {
                  setShowModal(false);
                }
              }}
            >
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="main-dashboard-container">
        <div className="main-header">
          <div className="main-text-head">
            <img src={back} onClick={() => setPage("main")} />
            <h1>Admission Fee Details</h1>
          </div>
          <button
            className={
              paymentId == "" ? "btn-grey btn btn-add" : "btn-blue btn btn-add"
            }
            // onClick={addApplicant}
            onClick={() => {
              
              setShowModal(true);
            }}
          >
            Pay Fee
          </button>
        </div>
      </div>
      <div className="payment-container">
        <div className="customer-info-container">
          <div className="user-account">
            <ApplicantCard type="payment" applicationId={applicationId} />
          </div>
          <div className="payment-summary-container">
            <p>Summary</p>
            <p className="payment-item">
              <div>Admission Fee</div>
              <div>PhP 600.00</div>
            </p>
          </div>
          <div className="total-amount-container">
            <p>Total Balance</p>
            <p id="total">PhP 600.00</p>
          </div>
        </div>
        <div className="payment-options-container">
          <div
            className={`${
              paymentId == 1 ? "payment-card-selected" : ""
            } payment-card`}
            onClick={() => {
              setPaymentId(1);
            }}
          >
            <img src={wallet} />
            <p>Cash Payment</p>
          </div>
          <div
            className={`${
              paymentId == 2 ? "payment-card-selected" : ""
            } payment-card`}
            onClick={() => {
              setPaymentId(2);
            }}
          >
            <img src={unionBank} className="union" />
            <p>UB Bills Payment</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
