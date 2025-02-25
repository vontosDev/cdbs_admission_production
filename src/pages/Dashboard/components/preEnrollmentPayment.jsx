import back from "../../../assets/images/back.png";
import ApplicantCard from "./ApplicantCard";
import wallet from "../../../assets/images/wallet.png";
// import card from "../../../assets/images/card.png";
import unionBank from "../../../assets/images/unionbank.jpeg";
import { Form, Modal } from "react-bootstrap";
import { useContext, useState } from "react";
import AdmissionsContext from "../../../context/AdmissionsContext";
import Swal from "sweetalert2";
import showEye from "../../../assets/images/showEye.svg";

function PreEnrollmentPayment({ setPage, dataIndex, applicationId, paymethodId }) {
  const [showModal, setShowModal] = useState(false);
  const { admissions } = useContext(AdmissionsContext);
  const [paymentId, setPaymentId] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);


  const handlePayment = async (paymentId) => {
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/accept_agreement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
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
      "https://donboscoapi.vercel.app/api/admission/accept_agreement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
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

  const handleFileChange = (type, selectedFiles) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const validFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      Swal.fire({
        title: "Invalid file type",
        text: "Invalid file format. Please upload a PNG, JPEG, or PDF file.",
        icon: "error",
      });
      return false;
    }

    setFiles(validFiles);
    setFileNames(validFiles.map((file) => file.name));
    return true;
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
          <div 
              className="close-icon" 
              onClick={() => {
                if (
                    admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['pay_method_id'] === 1 ||
                    admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['pay_method_id'] === 2
                ) {
                  setPage("main");
                } else {
                  setShowModal(false);
                }
              }}
            >
              ✕
            </div>
            <img
              src={paymethodId == 1 || paymentId == 1 ? wallet : unionBank}
              className="logo-verification"
            />
            <h1>
              {paymethodId == 1 || paymentId == 1
                ? "Payment Instructions for Admission Fee (Cash Payment)"
                : "Pay through UnionBank Bills Payment"}
            </h1>
            <h3 style={{ textAlign: "center", fontFamily: 'Roboto, sans-serif' }}>
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
            <h3 style={{ textAlign: "center", fontFamily: 'Roboto, sans-serif' }}>
              {paymethodId == 1 || paymentId == 1
                ? "1. Payment Location: Cashier, Caritas Don Bosco School Lobby"
                : "2. Once the UB account is created, go to ''Pay Bills'', ''Select Biller'', and search ''Caritas Don Bosco School''."}
            </h3>
            <h3 style={{ textAlign: "center", fontFamily: 'Roboto, sans-serif' }}>
              {paymethodId == 1 || paymentId == 1
                ? "2. Payment Hours: Monday to Friday: 7:00 AM - 4:00; Saturday, 8:00AM - 12:00 PM."
                : "The account will be ready to use for any CDBS transaction."}
            </h3>
            <h3 style={{ textAlign: "center", fontFamily: 'Roboto, sans-serif' }}>
              {paymethodId == 1 || paymentId == 1
                ? " 3. A receipt will be issued as proof of payment. Please keep it for reference."
                : "3. Once payment is made, kindly enter the reference number below."}
            </h3>
            <h3 style={{ textAlign: "center", fontFamily: 'Roboto, sans-serif' }}>
              {paymethodId == 1 || paymentId == 1
                ? " 4. Sales Invoice number must be accomplished after payment at the cashier. "
                : "4. Sales Invoice number must be accomplished after payment. "}
            </h3>

            <hr className="payment-line" />
            {/* <h2>{formData.email}</h2> */}
            {
              admissions["admissionsArr"][dataIndex]['reference_no']=null?
              <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
                Your payment is currently being verified. Please allow a moment for processing. Thank you for your patience!
              </h3>:
              <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
                Please enter{" "}
                {paymethodId == 1 || paymentId == 1
                  ? "Sales Invoice"
                  : "Reference"}{" "}
                Number:
              </h3>
            }
            
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
                    admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['reference_number'] || referenceNo
                  }
                  onChange={(e) => setReferenceNo(e.target.value)}
                  required
                />
              </Form.Group>

              { (
          <>
            <button
              style={{
                padding: "8px 12px",
                backgroundColor: 
                  fileNames.length === 0 && 
                  admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment'] == null
                    ? "#012169" // Blue color if true
                    : "gray", // Gray color if false
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: 
                  fileNames.length === 0 && 
                  admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment'] == null
                    ? "pointer" // Clickable if true
                    : "not-allowed", // Not clickable if false
                width: "20rem",
                height: "4rem",
                fontSize: "12px",
                opacity: 
                  fileNames.length === 0 && 
                  admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment'] == null
                    ? 1 // Fully visible if true
                    : 0.6, // Dimmed if false
              }}
              disabled={
                !(fileNames.length === 0 && admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment'] == null)
              } // Disables button when the condition is false
              onClick={() =>
                document.getElementById("uploadInput")?.click()
              }
            >
              Upload Proof of Payment
            </button>
            <input
              id="uploadInput"
              type="file"
              style={{ display: "none" }}
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                if (handleFileChange("proof", selectedFiles)) {
                  e.target.value = ""; // Reset the input
                }
              }}
            />
          </>
        )}
            </div>
            <br></br>
            
            <div>
              {fileNames.length>0 ? (
                fileNames.map((el, i) => (
                  <div className="item-upload" key={i}>
                    <h4 className="file-text">{el}</h4>
                    <span
                      className="delete-upload-item"
                      onClick={() => {
                        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== i));
                        setFileNames((prevFileNames) => prevFileNames.filter((_, index) => index !== i));
                      }}
                      style={{ cursor: "pointer", color: "red" }}
                    >
                      X
                    </span>
                  </div>
                ))
              ) : null}
            </div>
            <br></br>
            <div>
            {admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['reference_number'] == null ? (
                <button
                  type="button"
                  onClick={async () => {
                    if (referenceNo.length !== 0 && fileNames.length !== 0) {
                      var result = await Swal.fire({
                        title: "Are you sure?",
                        text: `Please check if reference number is correct: ${referenceNo}`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonColor: "No",
                      });

                      if (result.isConfirmed) {
                        //handlePayment(paymentId);
                        //handleRefNo();
                        try{
                          const formData = new FormData();
                          const admissionId = admissions["admissionsArr"][dataIndex]["admission_id"];
                          formData.append("paymethod",paymentId);
                          formData.append("payer_id",admissionId);
                          formData.append("reference_no",referenceNo);
                          formData.append("bucket_name",'support_documents');
                          files.forEach((file, index) => {
                            formData.append(`files`, file);
                          });
                          const fileUploadResponse = await fetch(
                            "https://donboscoapi.vercel.app/api/admission/pay_pre_enrollment",
                            {
                              method: "POST",
                              headers: {
                                "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
                                "supabase-key":
                                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
                              },
                              body: formData,
                            }
                          );
                          
                          if (fileUploadResponse.status) {
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

                        }catch (error) {
                          console.error("Error uploading file:", error);
                        }
                        // return;
                      } else {
                        return;
                      }
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: referenceNo.length === 0 || fileNames.length === 0 ? "#B0B0B0" : "#012169", // Gray when disabled
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: referenceNo.length === 0 || fileNames.length === 0 ? "not-allowed" : "pointer", // Change cursor when disabled
                    width: "45rem",
                    height: "4rem",
                    fontSize: "12px",
                  }}
                >
                  Submit
                </button>
              ) : (
              
              <>
                <div className="upload-view-btn-container">
                                      <a
                                        id="view-upload"
                                        href={
                                          Array.isArray(admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment'])
                                            ? admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment']
                                            : admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['proof_of_payment'].replace(/[\[\]"]/g, "")
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <span className="btn-view">
                                          <img src={showEye} /> Uploaded File
                                        </span>
                                      </a>
                                      </div>
              </>)}
            </div>

            <hr className="line-container" />
            
          </div>
        </Modal.Body>
      </Modal>

      <div className="main-dashboard-container">
        <div className="main-header">
          <div className="main-text-head">
            <img src={back} onClick={() => setPage("main")} />
            <h1>Reservation Fee Details</h1>
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
              <div>Reservation Fee</div>
              <div>₱ 3,000.00</div>
            </p>
          </div>
          <div className="total-amount-container">
            <p>Total Balance</p>
            <p id="total">₱ 3,000.00</p>
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

export default PreEnrollmentPayment;
