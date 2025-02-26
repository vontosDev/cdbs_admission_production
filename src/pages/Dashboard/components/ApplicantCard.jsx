import image from "../../../assets/images/logo.png";
import Swal from "sweetalert2";
import { useState } from "react";

function ApplicantCard({
  status,
  type = "default",
  name,
  applicationId,
  selectApplicationId,
  selectedId,
  admissionId,
  handleUserAdmission,
  handleDataIndex,
  handleSelectedAdmission,
  getAdmissionData,
  getLengthRequirements,
  admissionData,
  index,
  clearFiles,
  setLoading,
}) {
  const handleDelete = async (admissionId) => {
    // setLoading(true);
    await fetch(
      "https://donboscoapi.vercel.app/api/admission/delete_admission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          admission_id: admissionId,
        }),
      }
    );
  };
  const getStatusText = () => {
    const admissionTable = admissionData["db_admission_table"];
    const isApplicationCreated = admissionTable["is_application_created"];
    const isCompleteView = admissionTable["is_complete_view"];
    const admissionStatus = admissionTable["admission_status"];
    const requiredDocuments = admissionTable["db_required_documents_table"] || [];
    const isAllRequiredFileUploaded = admissionTable["is_all_required_file_uploaded"];
    const isPaid =admissionTable["is_paid"];
    const payMethod =admissionTable["paymethod_id"];
    const pendingCount = requiredDocuments.filter(doc => doc.document_status === "pending").length;
    const rejectCount = requiredDocuments.filter(doc => doc.document_status === "rejected").length;
    const examSchedCount = admissionTable["db_exam_admission_schedule"].length;
    const isAssess=admissionTable["is_for_assessment"];
    const isResult = admissionTable["is_final_result"];
    const isPassed =admissionTable["is_passed"];
    const isAttended = admissionTable["db_exam_admission_schedule"]?.[0]?.["is_attended"];
    const toPreEnrollment = admissionTable["is_preenrollment_reservation"] ?? false;
    const preEnrollmentStatus = admissionTable?.["db_payments_table"]?.[0]?.['status'] || '';
    // Check application creation and status
    if (!isApplicationCreated && !isCompleteView) {
      return { text: "Application - Ready to proceed", color: "yellow" };
    }
  
    if ((isApplicationCreated && !isCompleteView) || isCompleteView) {
      
      if (isApplicationCreated && requiredDocuments.length==0 && rejectCount ===0 ) {
        return { text: "Requirements - Ready to proceed", color: "yellow" };
      }
      if (isApplicationCreated && requiredDocuments.length>0 &&!isAllRequiredFileUploaded && rejectCount==0) {
        return { text: "Requirements - Awaiting approval", color: "blue" };
      }
      
      if (isApplicationCreated && rejectCount > 0) {
        return { text: "Requirements - Rejected, revisions needed", color: "red" };
      }
      
    }
  
    // Check requirements status
    if (isApplicationCreated && isCompleteView) {
  
      if (pendingCount > 0 && rejectCount === 0) {
        return { text: "Requirements - Awaiting approval", color: "blue" };
      }
  
      if (rejectCount > 0) {
        return { text: "Requirements - Rejected, revisions needed", color: "red" };
      }
    }
  
    // Check if all required files are uploaded
    if (isAllRequiredFileUploaded && payMethod===null) {
      return { text: "Payment - Ready to proceed", color: "yellow" };
    }

    if (payMethod !== null && !isPaid) {
      return { text: "Payment - Awaiting approval", color: "blue" };
    }

    if(isPaid && examSchedCount===0){
      return { text: "Assessment Exam - Ready to proceed", color: "yellow" };
    }

    if(isPaid && examSchedCount>0){
      if(!isAssess){
        if(!isAttended && isAttended!=null){
          return { text: "Assessment Exam - Not Attended", color: "red" };
        }else{
          return { text: "Assessment Exam - Awaiting approval", color: "blue" };
        } 
      }
    }

    if(isAssess && !isResult){
      return { text: "Results - Awaiting approval", color: "blue" };
    }

    if(isResult && isPassed){
      if(toPreEnrollment){
        if(preEnrollmentStatus==''){
          return { text: "Reservation - Ready to proceed", color: "yellow" };
        }else if(preEnrollmentStatus=='pending'){
          return { text: "Reservation - Ready to proceed", color: "blue" };
        }else{
          return { text: "Requirements - Ready to proceed", color: "yellow" };
        }
      }else{
        return { text: "Results - Passed", color: "green" };
      }
      
    }

    if(!isPassed){
      return { text: "Results - Failed", color: "red" };
    }
    
  
    // Default case
    return { text: "Application - Ready to proceed", color: "yellow" };
  };
  

  return (
    <div
      onClick={() => {
        selectApplicationId(admissionId);
        handleDataIndex(index);
        handleSelectedAdmission(admissionId);
        // getAdmissionData();
        getLengthRequirements();
        clearFiles();
      }}
      className={`applicant-card ${
        admissionId === selectedId ? "applicant-card-selected" : ""
      }`}
      style={
        type === "payment"
          ? {
              height: "12rem",
              display: "flex",
              alignItems: "center",
              gap: "4rem",
              justifyContent: "start",
              paddingBottom: "2rem",
            }
          : {}
      }
    >
      {type != "payment" ? (
        <div
          className="trash-btn"
          onClick={async () => {
            var result = await Swal.fire({
              title: "Delete this application?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonColor: "No",
            });

            if (result.isConfirmed) {
              await handleDelete(admissionId);
              handleDataIndex(0);
              handleSelectedAdmission("");
              // return;
            } else {
              return;
            }
            handleUserAdmission();
          }}
          style={{
            backgroundColor: admissionId === selectedId ? "" : "transparent",
            color: admissionId === selectedId ? "" : "transparent",
          }}
        >
          ╳
        </div>
      ) : null}
      <img src={image} className="id-picture" />
      <div
        className="card-text-info"
        style={
          type === "payment"
            ? {
                height: "12rem",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
                margin: "0",
              }
            : {}
        }
      >
        <div className="applicant-info">
          <span
            className="applicant-text"
            style={
              type === "payment"
                ? {
                    fontSize: "1.8rem",
                    fontWeight: "normal",
                  }
                : {}
            }
          >
            {name}
          </span>
          <span
            className="applicant-text"
            style={
              type === "payment"
                ? {
                    fontSize: "1.8rem",
                    fontWeight: "normal",
                    // color: "red",
                  }
                : {
                    // fontStyle: "italic",
                    // fontSize: "1.8rem",
                    // fontWeight: "normal",
                    // textDecoration: "italic",
                  }
            }
          >
            Application ID:{" "}
            <span
              style={{
                fontStyle: `${applicationId == "null" ? "italic" : "normal"}`,
                color: `${applicationId == "null" ? "#d0d0d0" : null}`,
              }}
            >{`${applicationId == "null" ? "none" : applicationId}`}</span>
          </span>
        </div>
        <div>
          {type == "default" ? (
            <p className="applicant-text">
              Status:{" "}
              <span
                className={/*`status-text${
                  getStatusText()["color"] == "green" ? "-green" : ""
                }`*/
                 `status-text${
                  getStatusText()["color"] === "green" ? "-green" : 
                  getStatusText()["color"] === "blue" ? "-blue" :
                  getStatusText()["color"] === "red" ? "-red" : ""
                }` 
              }
              >
                {getStatusText()["text"]}
              </span>
              {/* <span
                className={`status-text${status == "complete" ? "-green" : ""}`}
              >
                {status == "complete" ? "Review Complete" : "In Progress"}
              </span> */}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ApplicantCard;
