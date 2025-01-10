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
    if (
      admissionData["db_admission_table"]["is_application_created"] &&
      !admissionData["db_admission_table"]["is_complete_view"] &&
      admissionData["db_admission_table"]["admission_status"] === "in review"
    ) {
      return { text: "Application - In Review", color: "yellow" };
    } else if (
      !admissionData["db_admission_table"]["is_all_required_file_uploaded"] &&
      admissionData["db_admission_table"]["admission_status"] === "in review" &&
      admissionData["db_admission_table"]["db_required_documents_table"]
        .length !== 0
    ) {
      return { text: "Requirements - In Review", color: "yellow" };
    } else if (
      admissionData["db_admission_table"]["is_for_assessment"] &&
      !admissionData["db_admission_table"]["is_final_result"]
    ) {
      return { text: "Results - In Review", color: "yellow" };
    } else if (admissionData["db_admission_table"]["is_final_result"]) {
      return { text: "Results - Available", color: "green" };
    } else if (
      admissionData["db_admission_table"]["db_exam_admission_schedule"].length >
      0
    ) {
      return { text: "Exam - Scheduled", color: "green" };
    } else if (
      admissionData["db_admission_table"]["is_application_created"] &&
      admissionData["db_admission_table"]["is_complete_view"] &&
      admissionData["db_admission_table"]["is_all_required_file_uploaded"] &&
      admissionData["db_admission_table"]["is_paid"]
    ) {
      return { text: "Schedule - Pending", color: "yellow" };
    } else if (
      admissionData["db_admission_table"]["is_application_created"] &&
      admissionData["db_admission_table"]["is_complete_view"] &&
      admissionData["db_admission_table"]["is_all_required_file_uploaded"] &&
      admissionData["db_admission_table"]["paymethod_id"] !== null
    ) {
      return { text: "Payment - Pending", color: "yellow" };
    } else if (
      admissionData["db_admission_table"]["is_application_created"] &&
      admissionData["db_admission_table"]["is_complete_view"] &&
      admissionData["db_admission_table"]["is_all_required_file_uploaded"]
    ) {
      return { text: "Requirements - Complete", color: "green" };
    } else if (
      !admissionData["db_admission_table"]["is_application_created"] ||
      !admissionData["db_admission_table"]["is_all_required_file_uploaded"]
    ) {
      return { text: "Application - In Progress", color: "yellow" };
    } else if (
      admissionData["db_admission_table"]["is_application_created"] &&
      admissionData["db_admission_table"]["is_complete_view"]
    ) {
      return { text: "Application - Complete", color: "green" };
    } else if (
      !admissionData["db_admission_table"]["is_paid"] &&
      admissionData["db_admission_table"]["is_complete_view"]
    ) {
      return { text: "Payment - In Progress", color: "yellow" };
    } else if (
      admissionData["db_admission_table"]["db_required_documents_table"]
        .length === 0
    ) {
      return { text: "Requirements - In Progress", color: "yellow" };
    }

    // Default case
    return { text: "Application - In Progress", color: "yellow" };
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
                className={`status-text${
                  getStatusText()["color"] == "green" ? "-green" : ""
                }`}
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
