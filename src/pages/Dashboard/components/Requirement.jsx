import attachment from "../../../assets/images/attachment.png";
import parentQuestionnaire from "../../../assets/documents/parent-questionnaire.pdf";
import recommendTeacher from "../../../assets/documents/recommendation-teacher.pdf";
import recommendSchoolHead from "../../../assets/documents/recommendation-counselor-school-head.pdf";
import nonCatholicWaiver from "../../../assets/documents/non-catholics.pdf";
import { useState, useRef, useContext } from "react";
import AdmissionsContext from "../../../context/AdmissionsContext";
import showEye from "../../../assets/images/showEye.svg";
import Swal from "sweetalert2";

function Requirement({
  fetchAdmissions,
  handleDeleteUploadedFiles,
  mainTitle,
  subTitle,
  fileText,
  requirements,
  typeId,
  dataIndex,
  handleRequirements,
  isRejected,
  setDownloadedFiles,
  downloadedFiles
}) {
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);
  const { admissions } = useContext(AdmissionsContext);
  const isRequiredViewing = admissions["admissionsArr"][dataIndex]["db_admission_table"]["is_requirements_viewing"];
  //const documentStatus = admissions?.["admissionsArr"]?.[dataIndex]?.['db_admission_table']?.["db_required_documents_table"]?.[0]?.["document_status"] || '';
  const documentStatus = admissions["admissionsArr"][dataIndex]["db_admission_table"]["db_required_documents_table"]
  .filter((el) => typeId === el.requirements_type) // Filter by reject_reason and typeId
  .map((el) => el.document_status);
  const requiredDocumentsTable  = admissions["admissionsArr"][dataIndex]["db_admission_table"]["db_required_documents_table"]
  .filter((el) => el.reject_reason && typeId === el.requirements_type) // Filter by reject_reason and typeId
  .map((el) => el.reject_reason)[0];
  const isPendingOrAccepted = documentStatus && (documentStatus === "pending" || documentStatus === "accepted");
  const hiddenFileInput = useRef(null);
  let uploadedFiles = [];
  let type;
  let docStatus;
  if (mainTitle == "Birth Certificate (PSA Copy)") {
    type = "birthCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 1),
    ];
  } else if (mainTitle == "Recent ID Photo") {
    type = "recentIdPhoto";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 2),
    ];
  } else if (mainTitle == "Parent Questionnaire") {
    type = "parentQuestionnaire";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 4),
    ];
  } else if (mainTitle == "Baptismal Certificate") {
    type = "baptismalCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 8),
    ];
  } else if (mainTitle == "First Communion Certificate") {
    type = "communionCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 9),
    ];
  } else if (mainTitle == "Parent’s Marriage Certificates") {
    type = "marriageCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 10),
    ];
  } else if (mainTitle == "Recommendation Letter") {
    type = "recoLetter";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 5),
    ];
  } else if (mainTitle == "Present Level Report Card") {
    type = "reportPresentCard";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 14),
    ];
    console.log(uploadedFiles)
  } else if (mainTitle == "Alien Certificate of Registration") {
    type = "alienCert";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 11),
    ];
  } else if (mainTitle == "Non-Catholic Waiver") {
    type = "nonCatholicWaiver";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 13),
    ];
  } else if (mainTitle == "Photocopy of Passport or Visa") {
    type = "passport";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 12),
    ];
  } else if (mainTitle == "Previous Level Report Card") {
    type = "reportPreviousCard";
    uploadedFiles = [
      ...admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el.requirements_type === 3),
    ];
  }


  const handleFileChange = (type, file) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const validFiles = file.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== file.length) {
      console.log("no");
      Swal.fire({
        title: "Invalid file type",
        text: "Invalid file format. Please upload a PNG, JPEG, or PDF file.",
        icon: "error",
      });
      return false;
    }

    handleRequirements((prevRequirements) =>
      prevRequirements.map((requirement) =>
        requirement.type === type ? { ...requirement, file } : requirement
      )
    );
    return true;
  };

  const handleClick = (type) => (event) => {
    // Check if the type is one of the restricted ones
    if (["parentQuestionnaire", "nonCatholicWaiver"].includes(type)) {
      if (!downloadedFiles[type]) return; // Prevent clicking if not downloaded
    }
  
    hiddenFileInput.current.click();
  };
  
  

  const markFileAsDownloaded = (type) => {
    setDownloadedFiles((prev) => {
      if (type === 5) {
        return { ...prev, recoLetter: { ...prev.recoLetter, teacher: true } };
      } else if (type === 15) {
        return { ...prev, recoLetter: { ...prev.recoLetter, schoolHead: true } };
      } else if (type === "nonCatholicWaiver") {
        return { ...prev, nonCatholicWaiver: true };
      } else if (type === "parentQuestionnaire") {
        return { ...prev, parentQuestionnaire: true };
      }
      return prev;
    });
  };

  
  const handleDownload = async (e, type, fileUrl) => {
    e.preventDefault();
    if (isPendingOrAccepted || !fileUrl) return;
  
    try {
      const admissionId = admissions["admissionsArr"][dataIndex]["admission_id"];
      const formData = new FormData();
      formData.append("admission_id", admissionId);
      formData.append("requirements_type", type.toString());
  
      const fileUploadResponse = await fetch(
        "https://donboscoapi.vercel.app/api/admission/upload_requirements",
        {
          method: "POST",
          headers: {
            "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
            "supabase-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
          },
          body: formData,
        }
      );
  
      console.log(await fileUploadResponse.json());
      fetchAdmissions();
  
      // Mark the file as downloaded
      markFileAsDownloaded(type);
      if(type===''){

      }
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download =
        type === 5
          ? "recommendation-teacher.pdf"
          : type === 15
          ? "recommendation-school-head-counselor.pdf"
          : `${type}.pdf`;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  

  return (
    <div
      className="requirement-container"
      //style={{ backgroundColor: isRejected ? "#ff9999" : "" }}
    >
      <div className="rqment-text">
        <div className="requirement-text">
          <div>
              <h2 className="main-requirement-text" style={{ position: 'relative' }}>
              {isRejected && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-5px', // Adjust to position the circle higher or lower
                      left: '-8px', // Adjust to position the circle more to the left or right
                      width: '15px', // Size of the circle
                      height: '15px', // Size of the circle
                      borderRadius: '50%', // Makes it a circle
                      backgroundColor: 'red', // Red color for the circle
                      zIndex: 1, // Ensure it floats on top
                    }}
                  />
                )}
                {mainTitle}
                <span style={{ color: "red", fontStyle: "italic" }}>
                  {isRejected ? " -- Please reupload "+"( "+requiredDocumentsTable+" )" : ""}
                </span>
              </h2>
            {type == "birthCert" ? (
              <>
                <h2 className="email-text">
                  Ensure that your <strong>birth certificate</strong> is issued
                  by the <strong>Philippine Statistics Authority (PSA).</strong>
                </h2>
                <h2 className="email-text">
                  Submit original, ensuring all pages are included.
                </h2>
              </>
            ) : null}
            {type == "recentIdPhoto" ? (
              <>
                <h2 className="email-text">
                  Please upload <strong>a clear 2x2 ID photo</strong> taken
                  within the last 3 months.
                </h2>
                <h2 className="email-text">
                  The photo should have a <strong>white background.</strong>
                </h2>
              </>
            ) : null}
            {type == "reportPreviousCard" ? (
              <>
                <h2 className="email-text">
                  Please ensure that you upload a{" "}
                  <strong>
                    clear copy of your child’s official report card
                  </strong>{" "}
                  , which should include the following details:
                </h2>
                <h2 className="email-text">
                  <strong>
                    <ul>
                      <li>learner’s full name</li>
                      <li>grade level</li>
                      <li>Learner Reference Number (LRN)</li>
                      <li>
                        first to fourth quarter{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (with final ratings)
                        </span>
                      </li>
                      <li>attendance records</li>
                      <li>
                        conduct grade{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (if applicable).
                        </span>
                      </li>
                    </ul>
                  </strong>
                </h2>
                <h2 className="email-text">
                  The report card must be an official, up-to-date copy
                  reflecting the information mentioned above, ensuring{" "}
                  <strong>all pages</strong> are included.
                </h2>
              </>
            ) : null}

          {type == "reportPresentCard"? (
              <>
                <h2 className="email-text">
                  Please ensure that you upload a{" "}
                  <strong>
                    clear copy of your child’s official report card
                  </strong>{" "}
                  , which should include the following details:
                </h2>
                <h2 className="email-text">
                  <strong>
                    <ul>
                      <li>learner’s full name</li>
                      <li>grade level</li>
                      <li>Learner Reference Number (LRN)</li>
                      <li>
                        first quarter grades{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (at a minimum)
                        </span>
                      </li>
                      <li>attendance records</li>
                      <li>
                        conduct grade{" "}
                        <span style={{ fontWeight: "400 " }}>
                          (if applicable).
                        </span>
                      </li>
                    </ul>
                  </strong>
                </h2>
                <h2 className="email-text">
                  The report card must be an official, up-to-date copy
                  reflecting the information mentioned above, ensuring{" "}
                  <strong>all pages</strong> are included.
                </h2>
              </>
            ) : null}
            {type == "recoLetter" ? (
              <>
                <h2 className="email-text">
                  Please download the recommendation letter format and provide
                  it to your school.
                </h2>

                <h2 className="email-text">
                  The school will then complete the letter and send it directly
                  to us via email at{" "}
                  <span style={{ textDecoration: "underline", color: "blue" }}>
                    cdbsadmissions@gmail.com.
                  </span>
                </h2>
                <h2 className="email-text">
                  Ensure that the letter is submitted by the school on your
                  behalf to complete the application process.
                </h2>
              </>
            ) : null}
            {type == "parentQuestionnaire" ? (
              <>
                <h2 className="email-text">
                  Please{" "}
                  <strong>download the parent questionnaire format</strong>,
                  fill it out completely, and{" "}
                  <strong>upload the completed form</strong> here.
                </h2>
              </>
            ) : null}

            {type == "nonCatholicWaiver" ? (
              <>
                <h2 className="email-text">
                  Please{" "}
                  <strong>download the non-catholic waiver format</strong>,
                  fill it out completely, and{" "}
                  <strong>upload the completed form</strong> here.
                </h2>
              </>
            ) : null}

            {fileNames.map((el, i) => (
              <div className="item-upload" key={i}>
                <h2 className="file-text">{el}</h2>
                <span
                  className="delete-upload-item"
                  onClick={() => {
                    // Remove the selected file from state
                    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== i));
                    setFileNames((prevFiles) => prevFiles.filter((_, index) => index !== i));
                    
                    // Reset the file input to allow reselection of the same file
                    const fileInput = document.getElementById('file-input-id');
                    if (fileInput) {
                      fileInput.value = '';
                    }

                    // Optionally handle file change after deletion
                    handleFileChange(type, files);
                  }}
                >
                  X
                </span>
              </div>
            ))}


              {mainTitle !== "Recommendation Letter"
                ? uploadedFiles.map((el, i) => (
                    <div className="upload-view-btn-container" key={i}>
                      {
                      <a
                        id="view-upload"
                        href={el.document_url[0]}  // Use the first URL in the array for the href
                        key={i}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the default link behavior
                      
                          // If `el.document_url` is a string, split it by commas to get an array of URLs
                          const urls = typeof el.document_url === 'string'
                            ? el.document_url.split(',').map(url => url.trim()) // Split and trim URLs
                            : Array.isArray(el.document_url)
                            ? el.document_url // If already an array, use it directly
                            : []; // Default to an empty array if neither string nor array
                      
                          // Log the URLs to check the result
                          console.log(urls);
                      
                          // Open each URL in a new tab
                          urls.forEach((url) => {
                            const cleanUrl = url.replace(/[\[\]"']/g, "");  // Clean any unwanted characters like brackets or quotes
                            console.log(`Opening URL: ${cleanUrl}`); // Log which URL is being opened
                            window.open(cleanUrl, '_blank');  // Open the cleaned URL in a new tab
                          });
                        }}
                    >
                      <span className="btn-view">
                        <img src={showEye} alt="view" /> Uploaded File
                      </span>
                    </a>
                    
                    
                      /*<a
                        id="view-upload"
                        href={
                          Array.isArray(el.document_url)
                            ? el.document_url[0]
                            : el.document_url.replace(/[\[\]"']/g, "")
                        }
                        key={i}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the default link behavior
                      
                          // If document_url is an array, loop through each URL and open it in a new tab
                          const urls = Array.isArray(el.document_url) ? el.document_url : [el.document_url];
                      
                          // Open each URL in a new tab
                          urls.forEach(url => {
                            window.open(url, '_blank');
                          });
                        }}
                      >
                        <span className="btn-view">
                          <img src={showEye} /> Uploaded File
                        </span>
                      </a>*/}
                      {(el.document_status !== "accepted" && !isRequiredViewing) && (  // Check if file is not approved or hasn't been uploaded yet
                        <button
                          className="close-btn"
                          onClick={async () => {
                            var result = await Swal.fire({
                              title: "Delete this uploaded file?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes",
                              cancelButtonColor: "No",
                            });
                            if (result.isConfirmed) {
                              await handleDeleteUploadedFiles(
                                el.requirements_type,
                                el.admission_id,
                                el.required_doc_id
                              );

                              fetchAdmissions();
                            } else {
                              return;
                            }
                          }} // Function to remove file
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))
                : null}

          </div>

          <div className="align-buttons-self">
            {mainTitle === "Parent Questionnaire" ? (
              //<a href={parentQuestionnaire} download="parent-questionnaire">
                <button
                  className="btn-blue btn btn-add"
                  style={{ width: "230px" }}
                  onClick={(e) => handleDownload(e, "parentQuestionnaire", parentQuestionnaire)}
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Download Questionnaire
                </button>
              //</a>
              
            ) : null}
            {mainTitle === "Recommendation Letter" && (
                <>
                  <button
                    className={`btn-blue btn btn-add ${isPendingOrAccepted ? "disabled" : ""}`}
                    style={{ width: "295px" }}
                    onClick={(e) => handleDownload(e, 5, recommendTeacher)}
                  >
                    Download Class Adviser or Subject Teacher
                  </button>

                  <button
                    className={`btn-blue btn btn-add reco-pad-left ${isPendingOrAccepted ? "disabled" : ""}`}
                    style={{ width: "290px" }}
                    onClick={(e) => handleDownload(e, 15, recommendSchoolHead)}
                  >
                    Download School Head or Counselor
                  </button>
                </>
              )
              }
            {mainTitle === "Non-Catholic Waiver" ? (
              //<a href={nonCatholicWaiver} download="non-catholic-waiver">
                <button
                  className="btn-blue btn btn-add reco-pad-left"
                  style={{ width: "230px" }}
                  onClick={(e) => handleDownload(e, "nonCatholicWaiver", nonCatholicWaiver)}
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Download Non-Catholic Waiver
                </button>
              //</a>
            ) : null}
          </div>
        </div>
      </div>

      {mainTitle !== "Recommendation Letter" && (
        (uploadedFiles.length === 0 || uploadedFiles.some((file) => file.document_status === "rejected")) && (
          <div className="attachment-icon">
            <input
              ref={hiddenFileInput}
              className="attach"
              style={{ marginTop: "70px", marginBottom: "70px" }}
              type="file"
              id="file-input-id"
              accept=".png, .jpeg, .jpg, .pdf"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (handleFileChange(type, files)) {
                  setFileNames(files.map((file) => file.name) || null);
                }
                e.target.value = '';
              }}
            />
            <img
              className="attachment-icon-button"
              src={attachment}
              onClick={handleClick(type)}
              hidden={type==='parentQuestionnaire'|| type==='nonCatholicWaiver'?!downloadedFiles[type]:false}
            />
          </div>
        )
      )}


      
    </div>
  );
}

export default Requirement;
