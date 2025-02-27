import { useState, useContext, useEffect } from "react";
import ApplicantCard from "./ApplicantCard";
import StatusTracker from "./StatusTracker";
import check from "../../../assets/images/green-check.png";
import back from "../../../assets/images/back.png";
import logo from "../../../assets/images/logo.png";
import SiblingForm from "./SiblingForm";
import ParentGuardianForm from "./ParentGuardianForm";
import Swal from "sweetalert2";
import Requirement from "./Requirement";
import BigCalendar from "./Calendar";
import ScheduleItem from "./ScheduleItem";
import Payment from "./Payment";
import UserContext from "../../../context/UserContext";
import { jwtVerify, SignJWT } from "jose";
import { Modal, Button, Form } from "react-bootstrap";
import AdmissionsContext from "../../../context/AdmissionsContext";
import ReactLoading from "react-loading";
import { createClient } from "@supabase/supabase-js";
import circle_cross from "../../../assets/images/circle_cross.png";
import Flatpickr from "react-flatpickr";
import "../../../assets/themes/material_blue.css";
import kinderAssessment from "../../../assets/documents/Kinder Assessment Reminder.pdf";
import preKinderAssessment from "../../../assets/documents/Pre-Kinder Assessment Reminder.pdf";
import grade1Assessment from "../../../assets/documents/Grade 1 Assessment Reminder.pdf";
import grade2to6Assessment from "../../../assets/documents/Grade 2 to 6 Assessment Reminder.pdf";
import showEye from "../../../assets/images/showEye.svg";
import PreEnrollmentPayment from "./preEnrollmentPayment";
//import StatusCircles from "./Legends"
function MainView({ setPage, page }) {

  const supabase = createClient('https://srseiyeepchrklzxawsm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU');

  const [realTimeChannel, setRealTimeChannel] = useState(null);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 1);
  maxDate.setMonth(11); // Set month to December (month 11)
  maxDate.setDate(31);  // Set to the last day of the month (December 31)
  maxDate.setHours(0, 0, 0, 0);  
  const [greeting, setGreeting] = useState("");
  const [cancelReasonString, setCancelReasonString] = useState("");
  const [application, setApplication] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const { user, setUser } = useContext(UserContext);
  const { admissions, setAdmissions } = useContext(AdmissionsContext);
  const [show, setShow] = useState(false);
  const [admissionSelected, setAdmissionSelected] = useState("");
  const [backgroundSelected, setBackgroundSelected] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [scheduleForDay, setScheduleForDay] = useState([]);
  const [datesAvailable, setDateAvailable] = useState([]);
  const [age, setAge] = useState(0);
  const [dob, setDob] = useState("");
  const [isFather, setIsFather] = useState(false);
  const [isMother, setIsMother] = useState(false);
  const [isGuardian, setIsGuardian] = useState(false);
  const [specialFile, setSpecialFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [edit, setEdit] = useState(false);
  const [dobHandled, setDobHandled] = useState(false);
  
  const [downloadedFiles, setDownloadedFiles] = useState({
    recoLetter: { teacher: false, schoolHead: false },
    nonCatholicWaiver: false,
    parentQuestionnaire: false,
  });


  
  
  
  
  const [requirements, setRequirements] = useState([
    { type: "birthCert", file: [] },
    { type: "recentIdPhoto", file: [] },
    { type: "parentQuestionnaire", file: [] },
    { type: "baptismalCert", file: [] },
    { type: "communionCert", file: [] },
    { type: "marriageCert", file: [] },
    { type: "recoLetter", file: [] },
    { type: "reportPreviousCard", file: [] },
    { type: "reportPresentCard", file: [] },
    { type: "nonCatholicWaiver", file: [] },
    { type: "passport", file: [] },
    { type: "alienCert", file: [] },
  ]);
  const [rejectRequirementIds, setRejectRequirementIds] = useState([
    { type: "birthCert", ids: [] },
    { type: "recentIdPhoto", ids: [] },
    { type: "parentQuestionnaire", ids: [] },
    { type: "baptismalCert", ids: [] },
    { type: "communionCert", ids: [] },
    { type: "marriageCert", ids: [] },
    { type: "recoLetter", ids: [] },
    { type: "reportPreviousCard", ids: [] },
    { type: "reportPresentCard", ids: [] },
    { type: "nonCatholicWaiver", ids: [] },
    { type: "passport", ids: [] },
    { type: "alienCert", ids: [] },
  ]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRequirementsModal, setRequirementsModal] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState({
    scheduleId: "",
    timeStart: "",
    timeEnd: "",
    location: "",
    date: "",
  });



  
  

  const [showReschedModal, setShowReschedModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [declarationPackage, setDeclarationPackage] = useState(false);
  const [declarationSupportingDoc, setDeclarationSupportingDoc] =
    useState(false);
  const [filePreviews, setFilePreviews] = useState([]);
  const [dataIndex, setDataIndex] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const nationalities = [
    "Filipino",
    "American",
    "Australian",
    "British",
    "Canadian",
    "Chinese",
    "Indian",
    "Korean",
    "Japanese",
    "Singaporean",
    "Vietnamese",
    "Others",
  ];
  const [provinces, setProvinces] = useState([]);
  const [selectedIdProvince, setSelectedIdProvince] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedIdCity, setSelectedIdCity] = useState([]);
  const [baranggays, setBaranggays] = useState([]);


  const checkExamStatus = (date, start_time, end_time) => {
    const today = new Date();
    const examDateObj = new Date(date); // Convert string date to Date object
    today.setHours(0, 0, 0, 0);
    examDateObj.setHours(0, 0, 0, 0);
    // Check if the exam date is in the past
    if (today > examDateObj) {
      // If today is after the exam date, the exam has passed
      return true;
    }
  
    // Check if today is the exam date
    if (today.toDateString() === examDateObj.toDateString()) {
      const currentTime = new Date();
  
      // Convert start_time and end_time to Date objects for comparison
      const [startHour, startMinutePart] = start_time.split(":");
      const startMinute = startMinutePart.split(" ")[0]; // Get minute part before AM/PM
      const startPeriod = startMinutePart.split(" ")[1]; // Get AM/PM
  
      const [endHour, endMinutePart] = end_time.split(":");
      const endMinute = endMinutePart.split(" ")[0]; // Get minute part before AM/PM
      const endPeriod = endMinutePart.split(" ")[1]; // Get AM/PM
  
      // Convert to 24-hour format (for both start_time and end_time)
      const startHour24 = startPeriod === "PM" ? parseInt(startHour) + 12 : parseInt(startHour);
      const endHour24 = endPeriod === "PM" ? parseInt(endHour) + 12 : parseInt(endHour);
  
      const startTimeObj = new Date(currentTime.setHours(startHour24, startMinute, 0, 0));
      const endTimeObj = new Date(currentTime.setHours(endHour24, endMinute, 0, 0));
  
      // Return true if the current time is past the exam's end time, meaning the exam has passed
      return currentTime > endTimeObj || currentTime >=startTimeObj;
    }
  
    return false; // Return false if it's not the exam date
  };
  
  
  const userId = localStorage.getItem("userId");

  let isApplicationPending;
  let isApplicationInReview;
  let isApplicationComplete;
  let isUploadComplete;
  let isUploadPending;
  let isUploadRejected;
  let isUploadInReview;

  let isAssessmentPending;
  let isPaymentComplete;
  let isPaymentPending;
  const [countAssessment, setCountAssessment] = useState(0);
  let isAssessmentSelected;
  let isPendingAssessment;
  let isResultSent;
  let isResultPending;
  let isPassed;
  let toPreRequirement;
  let preEnrollmentStatus;
  let toPreEnrollment;
  let isAssessmentAttended;

  let requirementsRejectedArr = [];

  const getUserAdmissions = async (forLoading) => {
    if (page == "main" || page == "upload") {
      setIsLoading(forLoading);
    }
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/get_user_admission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    const result = await response.json();
    handleDobChange();
    setAdmissions(() => {
      return {
        admissionsArr: [...result.user],
      };
    });
    setIsLoading(false);
  };

  //calculate date if difference is 2 days
  const getDateDifferenceInDays = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Converts time difference to days
  };

 /* const getUserAdmissions = async (forLoading) => {
    if (page === "main" || page === "upload") {
      setIsLoading(forLoading);
    }
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/get_user_admission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": 'https://srseiyeepchrklzxawsm.supabase.co',
          "supabase-key": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    const result = await response.json();
    if((!dobHandled)){
        handleDobChange();
        setDobHandled(true);
    }
    if (response.ok) {
      console.log(result);
      setAdmissions(() => ({
        admissionsArr: [...result.user],
      }));

      // Set up real-time updates
      if (!realTimeChannel) {
        const channelName = `admission_updates_${userId}`;
        const channel = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "db_user_form_application_table" },
            (payload) => {
              console.log("Real-time update:", payload);

              // Handle incoming updates
              const updatedAdmissions = admissions.admissionsArr.map((admission) =>
                admission.id === payload.new.id ? payload.new : admission
              );
              setAdmissions({ admissionsArr: updatedAdmissions });
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log(`Subscribed to channel: ${channelName}`);
            }
          });

        setRealTimeChannel(channel);
      }
    } else {
      console.error("Failed to fetch user admissions:", result.error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // Cleanup function to unsubscribe from the channel when the component unmounts
    return () => {
      if (realTimeChannel) {
        realTimeChannel.unsubscribe().then(() => {
          console.log("Unsubscribed from real-time updates");
        });
      }
    };
  }, [realTimeChannel]);*/

  const updateGreeting = () => {
    getUserAdmissions(false);
    //handleDobChange();
    const hour = new Date().getHours();
    let newGreeting = "";
    if (hour >= 5 && hour < 12) {
      newGreeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      newGreeting = "Good afternoon";
    } else {
      newGreeting = "Good evening";
    }
     // Debug log
    setGreeting(newGreeting);
    console.log("Setting greeting to:", greeting);
  };

  // Use useEffect to initialize the greeting and set up the interval
  useEffect(() => {
    updateGreeting(); 
    const timer = setInterval(updateGreeting, 30000); // Update every 10 seconds
    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  const handleDeleteUploadedFiles = async (
    requirementType,
    admissionId,
    requiredDocId
  ) => {
    setIsLoading(true);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/remove_requirements",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          requirements_type: requirementType,
          admission_id: admissionId,
          required_doc_id: requiredDocId,
        }),
      }
    );
    getUserAdmissions(false);
    console.log(await response.json());
  };

  console.log(dataIndex)

  const getLengthRequirements = () => {
    const levelApplyingFor =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "level_applying_for"
      ];

    const religion =
      admissions["admissionsArr"][dataIndex]["db_admission_table"]["religion"];

    const citizenship =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "citizenship"
      ];

    const requirementSet = ["birth-cert", "id-photo"];
    if (levelApplyingFor == "Grade 1") {
      // Present Report Card only
      requirementSet.push("present-report-card");
    } else if (levelApplyingFor != "Kinder") {
      console.log(levelApplyingFor);
      // Prev and Present Report Card: Grade 2 - Grade 11

      if (levelApplyingFor != "Pre-Kinder") {
        requirementSet.push("present-report-card");
        requirementSet.push("previous-report-card");
      }
    }

    if (levelApplyingFor == "Kinder" || levelApplyingFor == "Pre-Kinder") {
      requirementSet.push("parent-questionnaire");
    }

    if (citizenship != "Filipino") {
      requirementSet.push("alien-cert");
      requirementSet.push("passport-visa");
    }

    if (religion != "Roman Catholic") {
      requirementSet.push("non-catholic-waiver");
    }
    console.log(`this the ${requirementSet.length}`);
    console.log(`REQ: ${requirementSet}`);
    return requirementSet.length;
  };

  if (dataIndex !== null) {
    requirementsRejectedArr = admissions["admissionsArr"][dataIndex][
      "db_admission_table"
    ]["db_required_documents_table"]
      .filter((el) => el.document_status == "rejected")
      .map((doc) => doc.requirements_type);

    isPassed = admissions["admissionsArr"][dataIndex]["db_admission_table"]["is_passed"];
    toPreRequirement = admissions["admissionsArr"][dataIndex]["db_admission_table"]["is_pre_requirement_submitted"];

    preEnrollmentStatus = admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['status'] || '';

    toPreEnrollment = admissions["admissionsArr"][dataIndex]["db_admission_table"]["is_preenrollment_reservation"] ?? false;

    isResultPending =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_for_assessment"
      ];

    isResultSent =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_final_result"
      ];

    isApplicationPending =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_application_created"
      ] &&
      !admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_complete_view"
      ];

    isApplicationInReview =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "admission_status"
      ] == "in review" &&
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_application_created"
      ];

    isApplicationComplete =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_complete_view"
      ];

    isUploadPending =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el["document_status"] == "pending").length > 0;

    isUploadRejected =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_required_documents_table"
      ].filter((el) => el["document_status"] == "rejected").length > 0;

    isUploadComplete =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_all_required_file_uploaded"
      ];

    isUploadInReview =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "admission_status"
      ] == "in review" &&
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_application_created"
      ] &&
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_all_required_file_uploaded"
      ] &&
      !admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_for_assessment"
      ] &&
      !admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_final_result"
      ];

    isPaymentPending =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "paymethod_id"
      ] != null;
    isPaymentComplete =
      admissions["admissionsArr"][dataIndex]["db_admission_table"]["is_paid"] ==
      true;
    isAssessmentPending =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_application_created"
      ] &&
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_all_required_file_uploaded"
      ] &&
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_for_assessment"
      ] &&
      !admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "is_final_result"
      ];

    isPaymentPending =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "paymethod_id"
      ] != null;

    isPendingAssessment =admissions["admissionsArr"][dataIndex]["db_admission_table"][
      "is_for_assessment"
    ] &&
    !admissions["admissionsArr"][dataIndex]["db_admission_table"][
      "is_final_result"
    ];

    isAssessmentSelected =
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_exam_admission_schedule"
      ].length > 0;


    if(isAssessmentSelected>0){
      //setCountAssessment(isAssessmentSelected);
      isAssessmentAttended= admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "db_exam_admission_schedule"
      ][0]["is_attended"];
    }
  }

  // console.log(isApplicationComplete);

  function convertMilitaryToAMPM(militaryTime) {
    const [hours, minutes] = militaryTime.split(":").map(Number);

    // Create a Date object with the given time (assuming today's date)
    const date = new Date();
    date.setHours(hours, minutes,0);

    // Use toLocaleString to format the time in 12-hour AM/PM format
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleString("en-US", options);
  }

  const handleScheduleDetails = (
    scheduleId,
    timeStart,
    timeEnd,
    location,
    date
  ) => {
    setScheduleDetails({
      scheduleId: scheduleId,
      timeStart: timeStart,
      timeEnd: timeEnd,
      location: location,
      date: date,
    });
  };

  const handleScheduleForDay = (day) => {
    // console.log(day);
    const date = new Date(day);
    const formattedDate = date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
    const finalDate = formattedDate.replaceAll("-", "-");
    console.log(finalDate);
    setScheduleForDay(schedules.filter((el) => el["exam_date"] == finalDate));
    console.log(scheduleForDay);
  };

  const handleFileDelete = (index) => {
    // console.log(typeof specialFile);
    setSpecialFile((prevFiles) =>
      Array.from(prevFiles).filter((_, i) => i !== index)
    );
  };

  const handleClearItems = () => {
    setSpecialFile(() => null);
    setFilePreviews(() => []);
  };

  const handleFetchCities = async (id) => {
    setCities(() => []);

    let nextPageUrl = `https://api.lbcx.ph/v1/locations/provinces/${id}/cities`;

    const response = await fetch(nextPageUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    const resultData = result["data"].map((city) => ({
      name: city["name"],
      id: city["id"],
    }));
    setCities(() => [...resultData]);

    console.log(cities);
  };

  const handleFetchBaranggays = async (id) => {
    setBaranggays(() => []);
    let nextPageUrl = `https://api.lbcx.ph/v1/locations/cities/${id}/district`;

    while (nextPageUrl != null) {
      const response = await fetch(nextPageUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      const resultData = result["data"].map((baranggay) => ({
        name: baranggay["name"],
        id: baranggay["id"],
      }));
      console.log(resultData);
      setBaranggays((prev) => [...prev, ...resultData]);
      nextPageUrl = result["next_page_url"];
      console.log(nextPageUrl);
      if (nextPageUrl != null) {
        nextPageUrl = `https://api.lbcx.ph/v1${nextPageUrl}`;
      }
    }

    //TODO

    console.log(cities);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    console.log(requirements);
    const lengthReq = getLengthRequirements();
    console.log(`UPLOAD: ${lengthReq}`);

    if (!edit) {
      if (
        lengthReq != requirements.filter((rqmt) => rqmt.file.length > 0).length
      ) {
        console.log("do not upload");
        setIsLoading(false);
        return;
      }
    }

    // Create an array to store promises for concurrent uploads
    const uploadPromises = [];

    for (let requirement of requirements) {
      if (requirement.file.length === 0) continue; // Skip if no files for this requirement

      const formData = new FormData();
      formData.append("bucket_name", "document_upload");
      
      // Append multiple files
      requirement.file.forEach(file => {
        formData.append("files", file);
      });

      // Add requirements_type based on the requirement type
      let requirementType;
      let docRequiredIds = [];

      switch (requirement.type) {
        case "birthCert":
          requirementType = 1;
          docRequiredIds = getRejectRequirementIds("birthCert");
          break;
        case "recentIdPhoto":
          requirementType = 2;
          docRequiredIds = getRejectRequirementIds("recentIdPhoto");
          break;
        case "reportPreviousCard":
          requirementType = 3;
          docRequiredIds = getRejectRequirementIds("reportPreviousCard");
          break;
        case "reportPresentCard":
          requirementType = 14;
          docRequiredIds = getRejectRequirementIds("reportPresentCard");
          break;
        case "parentQuestionnaire":
          requirementType = 4;
          docRequiredIds = getRejectRequirementIds("parentQuestionnaire");
          break;
        case "baptismalCert":
          requirementType = 8;
          docRequiredIds = getRejectRequirementIds("baptismalCert");
          break;
        case "communionCert":
          requirementType = 9;
          docRequiredIds = getRejectRequirementIds("communionCert");
          break;
        case "marriageCert":
          requirementType = 10;
          docRequiredIds = getRejectRequirementIds("marriageCert");
          break;
        case "recoLetter":
          requirementType = 5;
          docRequiredIds = getRejectRequirementIds("recoLetter");
          break;
        case "nonCatholicWaiver":
          requirementType = 13;
          docRequiredIds = getRejectRequirementIds("nonCatholicWaiver");
          break;
        case "alienCert":
          requirementType = 11;
          docRequiredIds = getRejectRequirementIds("alienCert");
          break;
        case "passport":
          requirementType = 12;
          docRequiredIds = getRejectRequirementIds("passport");
          break;
        default:
          break;
      }

      formData.append("requirements_type", requirementType);
      
      // Append reject IDs to formData if any
      docRequiredIds.forEach(id => {
        formData.append("doc_required_id", id);
      });

      formData.append("admission_id", admissionSelected);

      // Push the upload promise to the array
      uploadPromises.push(
        fetch("https://donboscoapi.vercel.app/api/admission/upload_requirements", {
          method: "POST",
          headers: {
            "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
            "supabase-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
          },
          body: formData,
        }).then((response) => response.json())
      );
    }

    try {
      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      console.log(uploadResults);

      // If all uploads are successful
      setIsLoading(false);
      Swal.fire({
        title: "Upload Complete",
        text: "Please wait for the files to be reviewed.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          setPage("main");
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading files:", error);
      Swal.fire({
        title: "Upload Failed",
        text: "There was an error uploading your files. Please try again.",
        icon: "error",
      });
    }
};

const getRejectRequirementIds = (type) => {
  // Return the list of rejected document ids based on the type
  const rejectDoc = rejectRequirementIds.find(el => el.type === type);
  return rejectDoc ? rejectDoc.ids : [];
};


  /*const handleUpload = async () => {
    setIsLoading(true);
    console.log(requirements);
    const lengthReq = getLengthRequirements();
    console.log(`UPLOAD: ${lengthReq}`);

    if (!edit) {
      if (
        lengthReq != requirements.filter((rqmt) => rqmt.file.length > 0).length
      ) {
        console.log("do not upload");
        setIsLoading(false);
        return;
      }
    }

    for (let requirement of requirements) {
      if (requirement.file.length === 0) continue; // Skip if no files for this requirement

      for (let file of requirement.file) {
        const formData = new FormData();
        formData.append("bucket_name", "document_upload");
        formData.append("files", file);
        // formData.append("");

        // Add requirements_type based on the requirement type
        switch (requirement.type) {
          case "birthCert":
            formData.append("requirements_type", 1);
            if (
              rejectRequirementIds.filter((el) => el.type == "birthCert")[0].ids
                .length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "birthCert"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;
          case "recentIdPhoto":
            formData.append("requirements_type", 2);
            if (
              rejectRequirementIds.filter((el) => el.type == "recentIdPhoto")[0]
                .ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "recentIdPhoto"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "reportPreviousCard":
            formData.append("requirements_type", 3);
            if (
              rejectRequirementIds.filter(
                (el) => el.type == "reportPreviousCard"
              )[0].ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "reportPreviousCard"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "reportPresentCard":
            formData.append("requirements_type", 14);
            if (
              rejectRequirementIds.filter(
                (el) => el.type == "reportPresentCard"
              )[0].ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "reportPresentCard"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "parentQuestionnaire":
            formData.append("requirements_type", 4);
            if (
              rejectRequirementIds.filter(
                (el) => el.type == "parentQuestionnaire"
              )[0].ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "parentQuestionnaire"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "baptismalCert":
            formData.append("requirements_type", 8);
            if (
              rejectRequirementIds.filter((el) => el.type == "baptismalCert")[0]
                .ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "baptismalCert"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "communionCert":
            formData.append("requirements_type", 9);
            if (
              rejectRequirementIds.filter((el) => el.type == "communionCert")[0]
                .ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "communionCert"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;
          case "marriageCert":
            formData.append("requirements_type", 10);
            if (
              rejectRequirementIds.filter((el) => el.type == "marriageCert")[0]
                .ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "marriageCert"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "recoLetter":
            formData.append("requirements_type", 5);
            if (
              rejectRequirementIds.filter((el) => el.type == "recoLetter")[0]
                .ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "recoLetter"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "nonCatholicWaiver":
            formData.append("requirements_type", 13);
            if (
              rejectRequirementIds.filter(
                (el) => el.type == "nonCatholicWaiver"
              )[0].ids.length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "nonCatholicWaiver"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "alienCert":
            formData.append("requirements_type", 11);
            if (
              rejectRequirementIds.filter((el) => el.type == "alienCert")[0].ids
                .length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "alienCert"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;

          case "passport":
            formData.append("requirements_type", 12);
            if (
              rejectRequirementIds.filter((el) => el.type == "passport")[0].ids
                .length > 0
            ) {
              for (let id of rejectRequirementIds.filter(
                (el) => el.type == "passport"
              ).ids) {
                formData.append("doc_required_id", id);
              }
            }
            break;
        }

        formData.append("admission_id", admissionSelected);

        try {
          const fileUploadResponse = await fetch(
            "https://donboscoapi.vercel.app/api/admission/upload_requirements",
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

          console.log(await fileUploadResponse.json());
        } catch (error) {
          console.error("Error uploading file:", file.name, error);
        }
      }
    }
    setIsLoading(false);
    Swal.fire({
      title: "Upload Complete",
      text: "Please wait for the files to be reviewed.",
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        setPage("main");
      }
    });
  };*/

  const handleShowCalendarModal = () => {
    setShowCalendarModal((prev) => !prev);
  };

  const handleChecked = (type, data) => {
    var isChecked =
      data.filter((el) => {
        return el["relationship_to_child"].toLowerCase() == type;
      }).length > 0;

    // console.log(isChecked);
    if (isChecked) {
      switch (type) {
        case "father":
          setIsFather(true);
          var father = data.filter(
            (el) => el["relationship_to_child"] == "father"
          )[0];
          // console.log(`FATHER: ${father}`);
          setFatherData({
            parentId: father["parent_id"],
            lastName: father["last_name"],
            firstName: father["first_name"],
            middleName: father["middle_name"],
            dateOfBirth: father["date_of_birth"],
            age: "",
            educationAttainment: father["educational_attainment"],
            employmentStatus: father["employment_status"],
            employedAt: father["employed_at"],
            officeAddress: father["office_address"],
            contactNo: father["contact_no"],
            position: father["job_position"],
            salary: father["salary_scale"],
          });
          break;
        case "mother":
          setIsMother(true);
          var mother = data.filter(
            (el) => el["relationship_to_child"] == "mother"
          )[0];
          setMotherData({
            parentId: mother["parent_id"],
            lastName: mother["last_name"],
            firstName: mother["first_name"],
            middleName: mother["middle_name"],
            dateOfBirth: mother["date_of_birth"],
            age: "",
            educationAttainment: mother["educational_attainment"],
            employmentStatus: mother["employment_status"],
            employedAt: mother["employed_at"],
            officeAddress: mother["office_address"],
            contactNo: mother["contact_no"],
            position: mother["job_position"],
            salary: mother["salary_scale"],
          });
          break;
        case "guardian":
          setIsGuardian(true);
          var guardian = data.filter(
            (el) => el["relationship_to_child"] == "guardian"
          )[0];
          setGuardianData({
            parentId: guardian["parent_id"],
            lastName: guardian["last_name"],
            firstName: guardian["first_name"],
            middleName: guardian["middle_name"],
            dateOfBirth: guardian["date_of_birth"],
            age: "",
            educationAttainment: guardian["educational_attainment"],
            employmentStatus: guardian["employment_status"],
            employedAt: guardian["employed_at"],
            officeAddress: guardian["office_address"],
            contactNo: guardian["contact_no"],
            position: guardian["job_position"],
            salary: guardian["salary_scale"],
          });
          break;
      }
    }
  };
  const [scheduleSlots, setScheduleSlots] = useState([
    {
      level: "Pre-Kinder",
      available: false,
    },
    {
      level: "Kinder",
      available: false,
    },
    {
      level: "Grade 1",
      available: false,
    },
    {
      level: "Grade 2",
      available: false,
    },
    {
      level: "Grade 3",
      available: false,
    },
    {
      level: "Grade 4",
      available: false,
    },
    {
      level: "Grade 5",
      available: false,
    },
    {
      level: "Grade 6",
      available: false,
    },
    {
      level: "Grade 7",
      available: false,
    },
    {
      level: "Grade 8",
      available: false,
    },
    {
      level: "Grade 9",
      available: false,
    },
    {
      level: "Grade 10",
      available: false,
    },
    {
      level: "Grade 11",
      available: false,
    },
    {
      level: "Grade 12",
      available: false,
    },
  ]);
  

  const [personalData, setPersonalData] = useState({
    levelApplyingFor: "",
    schoolYear: "",
    familyName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    age: "",
    sex: "",
    religion: "",
    otherReligion: "",
    citizenship: "",
    otherCitizenship: "",
    acrNumber: "",
    address: "",
    province: "",
    city: "",
    baranggay: "",
    postalCode: "",
    contactNo: "",
    languages: "",
    usualCompanion: "",
  });

  const [academicData, setAcademicData] = useState({
    namePresentSchool: "",
    addressPresentSchool: "",
    presentSchoolContactNo: "",
    awardsHonor: "",
    escGrantee: "",
    currentGrade: "",
    currentSchoolYear: "",
  });

  const [familyData, setFamilyData] = useState({
    noOfSiblings: 0,
    siblings: [],
  });

  const [family2Data, setFamily2Data] = useState({
    parentStatus: "",
    civilWedding: "",
    churchName: "",
    relationshipToChildGuardian: "",
    parentGuardian: [],
  });

  const [fatherData, setFatherData] = useState({
    parentId: "",
    lastName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    age: "",
    educationAttainment: "",
    employmentStatus: "",
    employedAt: "",
    officeAddress: "",
    contactNo: "",
    position: "",
    salary: "",
  });

  const [motherData, setMotherData] = useState({
    parentId: "",
    lastName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    age: "",
    educationAttainment: "",
    employmentStatus: "",
    employedAt: "",
    officeAddress: "",
    contactNo: "",
    position: "",
    salary: "",
  });

  const [guardianData, setGuardianData] = useState({
    parentId: "",
    background_id: "",
    lastName: "",
    firstName: "",
    middleName: "",
    dateOfBirth: "",
    age: "",
    educationAttainment: "",
    employmentStatus: "",
    employedAt: "",
    officeAddress: "",
    contactNo: "",
    position: "",
    salary: "",
  });

  const [specialConcernsData, setSpecialConcernsData] = useState({
    specialConcern: "",
    medicalCondition: "",
    medication: "",
    intervention: "",
    admissionId: "",
    bucketName: "",
  });

  const [surveyData, setSurveyData] = useState({
    heardList: [],
    heardOthers: "",
    factorsInfluenceList: [],
    factorsOthers: "",
  });

  const SECRET_KEY = new TextEncoder().encode("secret-123");
  var sessionToken = localStorage.getItem("sessionToken");

  const [isLoading, setIsLoading] = useState(false);
  const [isSlotsLoading, setSlotsLoading] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSlotCheck = async () => {
    setSlotsLoading(true);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/check_slot",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
      }
    );
    const responseData = await response.json();
    const data = responseData["data"];
    console.log(data);
    const isPreKinderSlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Pre-Kinder" && el["slot_full"] == false
      ).length > 0;
    const isKinderSlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Kinder" && el["slot_full"] == false
      ).length > 0;
    const isG1SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 1" && el["slot_full"] == false
      ).length > 0;
    const isG2SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 2" && el["slot_full"] == false
      ).length > 0;
    const isG3SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 3" && el["slot_full"] == false
      ).length > 0;
    const isG4SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 4" && el["slot_full"] == false
      ).length > 0;
    const isG5SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 5" && el["slot_full"] == false
      ).length > 0;
    const isG6SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 6" && el["slot_full"] == false
      ).length > 0;
    const isG7SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 7" && el["slot_full"] == false
      ).length > 0;
    const isG8SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 8" && el["slot_full"] == false
      ).length > 0;
    const isG9SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 9" && el["slot_full"] == false
      ).length > 0;
    const isG10SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 10" && el["slot_full"] == false
      ).length > 0;
    const isG11SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 11" && el["slot_full"] == false
      ).length > 0;
    const isG12SlotsAvailable =
      data.filter(
        (el) => el["level_applying"] == "Grade 12" && el["slot_full"] == false
      ).length > 0;
    console.log(isPreKinderSlotsAvailable, isG1SlotsAvailable);
    const slotsAvailable = [
      {
        level: "Pre-Kinder",
        available: isPreKinderSlotsAvailable,
      },
      {
        level: "Kinder",
        available: isKinderSlotsAvailable,
      },
      {
        level: "Grade 1",
        available: isG1SlotsAvailable,
      },
      {
        level: "Grade 2",
        available: isG2SlotsAvailable,
      },
      {
        level: "Grade 3",
        available: isG3SlotsAvailable,
      },
      {
        level: "Grade 4",
        available: isG4SlotsAvailable,
      },
      {
        level: "Grade 5",
        available: isG5SlotsAvailable,
      },
      {
        level: "Grade 6",
        available: isG6SlotsAvailable,
      },
      {
        level: "Grade 7",
        available: isG7SlotsAvailable,
      },
      {
        level: "Grade 8",
        available: isG8SlotsAvailable,
      },
      {
        level: "Grade 9",
        available: isG9SlotsAvailable,
      },
      {
        level: "Grade 10",
        available: isG10SlotsAvailable,
      },
      {
        level: "Grade 11",
        available: isG11SlotsAvailable,
      },
      {
        level: "Grade 12",
        available: isG12SlotsAvailable,
      },
    ];
    console.log(slotsAvailable);

    setScheduleSlots(slotsAvailable);
    setSlotsLoading(false);
  };

  const reserveDate = async (scheduleId, gradeLevel) => {
    console.log(scheduleId);
    console.log(gradeLevel);
    setIsLoading(true);

    let revisedLevelString = "";
    revisedLevelString =gradeLevel;
    /*if (gradeLevel == "Pre Kinder" || gradeLevel == "Kinder") {
      revisedLevelString = "Pre Kinder & Kinder";
    } else if (gradeLevel == "Grade 1") {
      revisedLevelString = "Grade 1";
    } else if (gradeLevel == "Grade 2") {
      revisedLevelString = "Grade 2";
    } else if (gradeLevel == "Grade 3") {
      revisedLevelString = "Grade 3";
    } else if (
      gradeLevel == "Grade 4" ||
      gradeLevel == "Grade 5" ||
      gradeLevel == "Grade 6"
    ) {
      revisedLevelString = "Grade 4 - 6";
    } else if (
      gradeLevel == "Grade 7" ||
      gradeLevel == "Grade 8" ||
      gradeLevel == "Grade 9" ||
      gradeLevel == "Grade 10" ||
      gradeLevel == "Grade 11" ||
      gradeLevel == "Grade 12"
    ) {
      revisedLevelString = "Grade 7 - 12";
    }*/
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/reserve_slot_exam",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          schedule_id: scheduleId,
          admission_id: admissionSelected,
          level_applying_for: revisedLevelString,
        }),
      }
    );
    console.log(await response.json());
    if (response.status == 200) {
      Swal.fire({
        title: "Schedule set",
        text: "Please take the exam on the selected schedule.",
        icon: "success",
      });
      setPage("main");
    } else {
      Swal.fire({
        title: "Schedule error!",
        text: "This slot has been taken. Please try again.",
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  const handleCheckboxChange = () => {
    setDeclarationPackage((prev) => !prev);
  };
  const handleSuppCheckboxChange = () => {
    setDeclarationSupportingDoc((prev) => !prev);
  };

  const handleSelectId = (id, famId) => {
    setAdmissionSelected(() => id);
    setBackgroundSelected(famId);
    // console.log(id);
  };

  const handleFileChange = (e) => {
    const files = e.target.files; // Declare files here
    const allowedFormats = ["image/png", "image/jpeg", "application/pdf"];
    
    // Check for invalid files after initializing files
    const invalidFiles = Array.from(files).filter(
      (file) => !allowedFormats.includes(file.type)
    );
  
    if (invalidFiles.length > 0) {
      alert("Incorrect file types have been uploaded");
    }
  
    setSpecialFile(files); // Set the selected files in state
    const previews = [];
  
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const isPDF = file.type === "application/pdf";
          previews.push({
            name: file.name,
            url: isPDF ? reader.result : reader.result, // PDF and image previews
            type: isPDF ? "pdf" : "image",
          });
  
          // Update state once all previews are generated
          if (previews.length === files.length) {
            setFilePreviews(previews);
          }
        };
  
        // Read files as data URLs for images and PDFs
        reader.readAsDataURL(file);
      });
    }
  };
  

  const handleChange = (e, type, subtype) => {
    const { id, value } = e.target;
    // console.log(e.target);
    switch (type) {
      case "personal":
        setPersonalData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
        break;

      case "academic":
        setAcademicData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
        break;

      case "family":
        setFamilyData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
        break;

      case "family2":
        if (subtype == "father") {
          setFatherData((prevData) => ({
            ...prevData,
            [id]: value,
          }));
        } else if (subtype == "mother") {
          setMotherData((prevData) => ({
            ...prevData,
            [id]: value,
          }));
        } else if (subtype == "guardian") {
          setGuardianData((prevData) => ({
            ...prevData,
            [id]: value,
          }));
        } else {
          setFamily2Data((prevData) => ({
            ...prevData,
            [id]: value,
          }));
        }
        break;

      case "specialConcerns":
        setSpecialConcernsData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
        break;

      case "survey":
        if (subtype == "addHeard") {
          if (surveyData.heardList.includes(value)) {
            setSurveyData((prevData) => ({
              ...prevData,
              heardList: prevData.heardList.filter((el) => el !== value),
            }));
          } else {
            setSurveyData((prevData) => ({
              ...prevData,
              heardList: [...prevData.heardList, value],
            }));
          }
        } else if (subtype == "addFactors") {
          if (surveyData.factorsInfluenceList.includes(value)) {
            setSurveyData((prevData) => ({
              ...prevData,
              factorsInfluenceList: prevData.factorsInfluenceList.filter(
                (el) => el !== value
              ),
            }));
          } else {
            setSurveyData((prevData) => ({
              ...prevData,
              factorsInfluenceList: [...prevData.factorsInfluenceList, value],
            }));
          }
        } else {
          setSurveyData((prevData) => ({
            ...prevData,
            [id]: value,
          }));
        }
        break;
    }
  };

  const handlePersonalSubmission = async () => {
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/create_admission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          admission_id: admissionSelected,
          user_id: userId,
          level_applying: personalData.levelApplyingFor,
          school_year: "2025-2026",
          fname: personalData.firstName,
          mname: personalData.middleName,
          lname: personalData.familyName,
          birthdate: personalData.dateOfBirth,
          birth_place: personalData.placeOfBirth,
          sex: personalData.sex,
          religion:
            personalData.religion == "Others"
              ? personalData.otherReligion
              : personalData.religion,
          citizenship:
            personalData.citizenship == "Others"
              ? personalData.otherCitizenship
              : personalData.citizenship,
          acr_no: personalData.acrNumber,
          address: `${personalData.address}|${personalData.baranggay}|${personalData.city}|${personalData.province}`,
          zip_postal: personalData.postalCode,
          contact_no: personalData.contactNo,
          languages_dialect: personalData.languages,
          companion_at_home: personalData.usualCompanion,
          admission_date: new Date().toISOString().split("T")[0],
        }),
      }
    );
    console.log(personalData);
  };

  const handleAcademicSubmission = async () => {
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/create_academic_background",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          admission_id: admissionSelected,
          user_id: userId,
          name_present_school: academicData.namePresentSchool,
          address_present_school: academicData.addressPresentSchool,
          present_school_contact_no: academicData.presentSchoolContactNo,
          awards_honor: academicData.awardsHonor,
          esc: academicData.escGrantee,
          current_grade: academicData.currentGrade,
          current_school_year: academicData.currentSchoolYear,
        }),
      }
    );
    console.log(academicData);
  };

  const handleFamilySubmission = async () => {
    setIsLoading(true);
    const listA = [
      ...familyData.siblings.map((el) => ({
        sibling_id: el["siblingId"],
        siblings_fname: el["siblingFirstName"],
        siblings_mname: el["siblingMiddleName"],
        siblings_lname: el["siblingFamilyName"],
        siblings_bday: el["siblingDob"],
        level_course_occupation: el["siblingOccupation"],
        school_business: el["siblingBusinessOffice"],
      })),
    ];
    console.log(`LIST: ${JSON.stringify(listA)}`);

    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/create_family_background_siblings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          admission_id: admissionSelected,
          no_siblings: familyData.noOfSiblings,
          siblings: listA,
        }),
      }

      // console.log
    );

    const result = await response.json();

    console.log(`RESULT: ${JSON.stringify(result)}`);
    console.log(`RESULT: ${result["family_background_id"]}`);
    setBackgroundSelected(() => result["family_background_id"]);
    setIsLoading(false);
  };

  const handleFamily2Submission = async () => {
    setIsLoading(true);
    let parentGuardianArr = [];
    let fatherObj;
    let motherObj;
    let guardianObj;

    if (isFather) {
      fatherObj = {
        parent_id: fatherData.parentId,
        p_fname: fatherData.firstName,
        p_mname: fatherData.middleName,
        p_lname: fatherData.lastName,
        p_birthday: fatherData.dateOfBirth,
        educational_attainment: fatherData.educationAttainment,
        employment_status: fatherData.employmentStatus,
        employed_at: fatherData.employedAt,
        office_address: fatherData.officeAddress,
        office_contact_no: fatherData.contactNo,
        position: fatherData.position,
        salary_scale: fatherData.salary,
        relationship: "father",
      };

      parentGuardianArr = [...parentGuardianArr, fatherObj];
    }

    if (isMother) {
      motherObj = {
        parent_id: motherData.parentId,
        p_fname: motherData.firstName,
        p_mname: motherData.middleName,
        p_lname: motherData.lastName,
        p_birthday: motherData.dateOfBirth,
        educational_attainment: motherData.educationAttainment,
        employment_status: motherData.employmentStatus,
        employed_at: motherData.employedAt,
        office_address: motherData.officeAddress,
        office_contact_no: motherData.contactNo,
        position: motherData.position,
        salary_scale: motherData.salary,
        relationship: "mother",
      };
      parentGuardianArr = [...parentGuardianArr, motherObj];
    }

    if (isGuardian) {
      console.log("hello");
      guardianObj = {
        parent_id: guardianData.parentId,
        p_fname: guardianData.firstName,
        p_mname: guardianData.middleName,
        p_lname: guardianData.lastName,
        p_birthday: guardianData.dateOfBirth,
        educational_attainment: guardianData.educationAttainment,
        employment_status: guardianData.employmentStatus,
        employed_at: guardianData.employedAt,
        office_address: guardianData.officeAddress,
        office_contact_no: guardianData.contactNo,
        position: guardianData.position,
        salary_scale: guardianData.salary,
        relationship: "guardian",
      };
      parentGuardianArr = [...parentGuardianArr, guardianObj];
    }
    // console.log(`LIST: ${JSON.stringify(listA)}`);
    console.log(`LIST: ${JSON.stringify(parentGuardianArr)}`);

    console.log(`BACKID: ${backgroundSelected}`);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/create_family_background_parent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          background_id: parseInt(backgroundSelected),
          parent_status: family2Data.parentStatus,
          civil_wedding: family2Data.civilWedding,
          church_name: family2Data.churchName,
          parent_guardian: [...parentGuardianArr],
        }),
      }

      // console.log
    );

    const result = await response.json();

    console.log(`RESULT: ${JSON.stringify(result)}, ${backgroundSelected}`);
    // setBackgroundSelected(() => result["family_background_id"]);
    setIsLoading(false);
  };

  const handleSpecialConcernSubmission = async () => {
    setIsLoading(true);
  
    try {
      const formData = new FormData();
  
      // Append other fields to FormData
      formData.append("admission_id", admissionSelected);
      formData.append("bucket_name", "support_documents");
      formData.append("special_concern", specialConcernsData.specialConcern);
      formData.append("medical_condition", specialConcernsData.medicalCondition);
      formData.append("medication", specialConcernsData.medication);
      formData.append("intervention", specialConcernsData.intervention);
      
      // Append files to FormData if any
      if (specialFile && specialFile.length > 0) {
        Array.from(specialFile).forEach((file) => {
          formData.append("files", file); // Repeated "files" key for multiple files
        });
      }
  
      // Send POST request
      const fileUploadResponse = await fetch(
        "https://donboscoapi.vercel.app/api/admission/create_special_concern",
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
  
      if (!fileUploadResponse.ok) {
        setUploadStatus("Failed to submit the form.");
        setSpecialFile(null);
        setFilePreviews([]);
        setIsLoading(false);
        return;
      }
  
      const fileUploadData = await fileUploadResponse.json();
      console.log("Submission Successful:", JSON.stringify(fileUploadData));
      setUploadStatus("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("An error occurred. Please try again.");
    }
  
    setIsLoading(false);
  };
  

  

  const handleSchedCancellation = async (easId, cancelReason) => {
    setIsLoading(true);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/cancel-schedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          eas_id: easId,
          cancel_reason: cancelReason,
        }),
      }
    );

    if (response.status == 200) {
      console.log(await response.json());
      Swal.fire({
        title: "Schedule cancelled",
        text: "Please pick a new schedule.",
        icon: "success",
      });
      setIsLoading(false);
    }
  };

  const handleSurveySubmission = async () => {
    setIsLoading(true);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/create_survey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          admission_id: admissionSelected,
          heard_about_school: [...surveyData.heardList].join(","),
          factors_influencing_decision: [
            ...surveyData.factorsInfluenceList,
          ].join(","),
        }),
      }
    );
    setIsLoading(false);
  };

  const handleAgreementDeclaration = async () => {
    setIsLoading(true);
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
          admission_id: admissionSelected,
          agreement_accepted: true,
        }),
      }
    );
    const result = await response.json();
    console.log(result);
    setIsLoading(false);
  };

  const getSchedules = async (levelApplyingFor) => {
    setIsLoading(true);
    let revisedLevelString = "";
    revisedLevelString=levelApplyingFor;
   /* if (levelApplyingFor == "Pre Kinder" || levelApplyingFor == "Kinder") {
      revisedLevelString = "Pre Kinder & Kinder";
    } else if (levelApplyingFor == "Grade 1") {
      revisedLevelString = "Grade 1";
    } else if (levelApplyingFor == "Grade 2") {
      revisedLevelString = "Grade 2";
    } else if (levelApplyingFor == "Grade 3") {
      revisedLevelString = "Grade 3";
    } else if (
      levelApplyingFor == "Grade 4" ||
      levelApplyingFor == "Grade 5" ||
      levelApplyingFor == "Grade 6"
    ) {
      revisedLevelString = "Grade 4 - 6";
    } else if (
      levelApplyingFor == "Grade 7" ||
      levelApplyingFor == "Grade 8" ||
      levelApplyingFor == "Grade 9" ||
      levelApplyingFor == "Grade 10" ||
      levelApplyingFor == "Grade 11" ||
      levelApplyingFor == "Grade 12"
    ) {
      revisedLevelString = "Grade 7 - 12";
    }*/

    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/check_exam_schedule",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          level_applying_for: revisedLevelString,
        }),
      }
    );
    const result = await response.json();

    if (response.status == 404) {
      setSchedules([]);
      setDateAvailable([]);
      return;
    }

    // console.log(result["exam_schedules"]);
    setSchedules(result["exam_schedules"]);
    setDateAvailable(
      result["exam_schedules"].map((el) => {
        const examDate = new Date(el["exam_date"]); // Convert exam_date to Date object
        examDate.setDate(examDate.getDate() - 1); // Subtract one day
        return examDate.toISOString().split("T")[0];
      })
    );

    setIsLoading(false);
  };

  // Function to check if required files are downloaded
  const areRequiredFilesDownloaded = () => {
    const { recoLetter, nonCatholicWaiver, parentQuestionnaire } = downloadedFiles;
    // Check if required files are downloaded
    
    const isParentAndWaiverDownloaded = parentQuestionnaire && nonCatholicWaiver;
    const isRecoLetterComplete = recoLetter.teacher && recoLetter.schoolHead;
    const isNonCatholicOnly = nonCatholicWaiver && !parentQuestionnaire && !isRecoLetterComplete;
    const isParentOnly = parentQuestionnaire && !nonCatholicWaiver && !isRecoLetterComplete;
    if(admissions["admissionsArr"][dataIndex]["db_admission_table"][
      "religion"
    ] != "Roman Catholic"){
      return (
        isParentAndWaiverDownloaded || // Parent Questionnaire only (if no other requirement exists)
        (isRecoLetterComplete && nonCatholicWaiver) // Both reco letters + non-Catholic waiver
      );
    }else{
      if(admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "level_applying_for"
      ] == "Kinder" ||
      admissions["admissionsArr"][dataIndex]["db_admission_table"][
        "level_applying_for"
      ] == "Pre-Kinder"){
        return (
          isParentOnly
        );
      }else{
        return (
          isRecoLetterComplete
        );
      }
    }
    
  };


  const getLevelAssessmentReminder=(level_applying_for)=>{

    if(level_applying_for=='Kinder' || level_applying_for=='kinder'){
      return kinderAssessment;
    }else if(level_applying_for=='Pre-Kinder' || level_applying_for=='pre-kinder'){
      return preKinderAssessment;
    }else if(level_applying_for=='Grade 1' || level_applying_for=='grade 1'){
      return grade1Assessment;
    }else{
      return grade2to6Assessment
    }

  }

  const getRequiredDocumentsCount = (level_applying_for, religion, citizenship) => {
    if (level_applying_for === "Kinder" || level_applying_for === "Pre-Kinder" || level_applying_for === "Grade 1") {
      if (religion !== "Roman Catholic" && citizenship !== "Filipino") {
        return 6;
      } else if (religion === "Roman Catholic" && citizenship !== "Filipino") {
        return 5;
      } else if (religion !== "Roman Catholic" && citizenship === "Filipino"){
        return 4;
      }else{
        return 3;
      }
    } else {
      if (religion !== "Roman Catholic" && citizenship !== "Filipino") {
        return 7;
      } else if (religion === "Roman Catholic" && citizenship !== "Filipino") {
        return 6;
      } else if (religion !== "Roman Catholic" && citizenship === "Filipino") {
        return 5;
      } else {
        return 4;
      }
    }
  };


  const getAdmissionData = async () => {
    setIsLoading(true);
    console.log(`SELECTED: ${admissionSelected}`);
    if (page == "main") {
    }
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/get_user_admission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          admission_id: admissionSelected,
        }),
      }
    );
    const result = await response.json();
    console.log(`DATA: ${JSON.stringify(result)}`);

    setPersonalData(() => {
      const religionList = [
        "No Religion",
        "Buddhism",
        "Roman Catholic",
        "Islam",
        "Seventh-Day Adventist",
        "Iglesia ni Cristo",
        "Philippine Independent Church",
        "Bible Baptist Church",
        "United Church of Christ in the Philippines",
        "Jehovah's Witnesses",
        "Church of Christ",
        "Born Again Christian",
      ];

      const address = result["user"][0]["db_admission_table"]["address"] ?? "";
      console.log(`ADDRESS: ${address}`);

      let firstLine = "";
      let barangay = "";
      let city = "";
      let province = "";
      if (address !== "") {
        const addressArr = address.split("|");
        firstLine = addressArr[0];
        province = addressArr[3];
        handleFetchCities(province);
        city = addressArr[2];
        handleFetchBaranggays(city);
        barangay = addressArr[1];
      }



      

      return {
        levelApplyingFor:
          result["user"][0]["db_admission_table"]["level_applying_for"],
        schoolYear: result["user"][0]["db_admission_table"]["school_year"],
        familyName: result["user"][0]["db_admission_table"]["last_name"],
        firstName: result["user"][0]["db_admission_table"]["first_name"],
        middleName: result["user"][0]["db_admission_table"]["middle_name"],
        dateOfBirth: result["user"][0]["db_admission_table"]["date_of_birth"],
        placeOfBirth: result["user"][0]["db_admission_table"]["place_of_birth"],
        sex: result["user"][0]["db_admission_table"]["sex"] ?? "",
        religion: religionList.includes(
          result["user"][0]["db_admission_table"]["religion"]
        )
          ? result["user"][0]["db_admission_table"]["religion"]
          : result["user"][0]["db_admission_table"]["religion"] == null
          ? ""
          : "Others",
        otherReligion: religionList.includes(
          result["user"][0]["db_admission_table"]["religion"]
        )
          ? ""
          : result["user"][0]["db_admission_table"]["religion"],
        citizenship: nationalities.includes(
          result["user"][0]["db_admission_table"]["citizenship"]
        )
          ? result["user"][0]["db_admission_table"]["citizenship"]
          : result["user"][0]["db_admission_table"]["citizenship"] == null
          ? ""
          : "Others",
        otherCitizenship: nationalities.includes(
          result["user"][0]["db_admission_table"]["citizenship"]
        )
          ? ""
          : result["user"][0]["db_admission_table"]["citizenship"],
        acrNumber: result["user"][0]["db_admission_table"]["acr_number"],
        address: firstLine ?? "",
        baranggay: barangay ?? "",
        city: city ?? "",
        province: province ?? "",
        postalCode: result["user"][0]["db_admission_table"]["zip_postal_code"],
        contactNo: result["user"][0]["db_admission_table"]["contact_no"],
        languages:
          result["user"][0]["db_admission_table"]["language_dialect_spoken"],
        usualCompanion:
          result["user"][0]["db_admission_table"]["usual_companion_at_home"],
      };
    });
    if (
      result["user"][0]["db_admission_table"]["db_academic_background"]
        .length != 0
    ) {
      setAcademicData(() => {
        return {
          namePresentSchool:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ][0]["name_of_present_school"] ?? "",
          addressPresentSchool:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ]?.[0]["address_of_present_school"] ?? "",
          presentSchoolContactNo:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ]?.[0]["school_contact_no"] ?? "",
          awardsHonor:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ]?.[0]["awards_honors_received"] ?? "",
          escGrantee:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ]?.[0]["esc_grantee"] ?? "",
          currentGrade:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ]?.[0]["current_grade_level"] ?? "",
          currentSchoolYear:
            result["user"][0]["db_admission_table"][
              "db_academic_background"
            ]?.[0]["school_year"] ?? "",
        };
      });
    }

    if (
      result["user"][0]["db_admission_table"]["db_family_background_table"]
        .length != 0
    ) {
      console.log("NO FAMILY BG");
      const siblingsArr = result["user"][0]["db_admission_table"][
        "db_family_background_table"
      ][0]["db_sibling_table"].map((el) => ({
        siblingId: el["sibling_id"],
        siblingFamilyName: el["sibling_last_name"],
        siblingFirstName: el["sibling_first_name"],
        siblingMiddleName: el["sibling_middle_name"],
        siblingDob: el["sibling_bday"],
        siblingAge: "",
        siblingOccupation: el["sibling_grade_course_occupation"],
        siblingBusinessOffice: el["sibling_school_business"],
      }));

      setFamilyData(() => {
        return {
          noOfSiblings:
            result["user"][0]["db_admission_table"][
              "db_family_background_table"
            ][0]["no_of_siblings"],
          siblings: siblingsArr,
        };
      });

      // if (
      //   result["user"][0]["db_admission_table"]["db_family_background_table"][0][
      //     "db_parent_table"
      //   ].length == 0
      // )
      //   return;

      console.log(
        result["user"][0]["db_admission_table"][
          "db_family_background_table"
        ][0]["db_parent_table"]
      );
      console.log(
        `DATA: ${result["user"][0]["db_admission_table"]["db_family_background_table"][0]["db_parent_table"]}`
      );
      setFamily2Data(() => {
        return {
          relationshipToChildGuardian: "",
          parentStatus:
            result["user"][0]["db_admission_table"][
              "db_family_background_table"
            ][0]["parent_status"] ?? "",
          civilWedding:
            result["user"][0]["db_admission_table"][
              "db_family_background_table"
            ][0]["civil_wedding"],
          churchName:
            result["user"][0]["db_admission_table"][
              "db_family_background_table"
            ][0]["church_name"],
          parentGuardian:
            result["user"][0]["db_admission_table"][
              "db_family_background_table"
            ][0]["db_parent_table"],
        };
      });

      handleChecked(
        "father",
        result["user"][0]["db_admission_table"][
          "db_family_background_table"
        ][0]["db_parent_table"]
      );

      handleChecked(
        "mother",
        result["user"][0]["db_admission_table"][
          "db_family_background_table"
        ][0]["db_parent_table"]
      );

      handleChecked(
        "guardian",
        result["user"][0]["db_admission_table"][
          "db_family_background_table"
        ][0]["db_parent_table"]
      );
    }

    // console.log(
    //   `RESULTA: ${result["user"][0]["db_admission_table"]["db_family_background_table"]["no_of_siblings"]}`
    // );

    if (
      result["user"][0]["db_admission_table"]["db_special_concerns_table"]
        .length == 0
    )
      return;

    setSpecialConcernsData(() => {
      return {
        specialConcern:
          result["user"][0]["db_admission_table"][
            "db_special_concerns_table"
          ][0]["special_concern"],
        medicalCondition:
          result["user"][0]["db_admission_table"][
            "db_special_concerns_table"
          ][0]["medical_condition"],
        medication:
          result["user"][0]["db_admission_table"][
            "db_special_concerns_table"
          ][0]["medication"],
        intervention:
          result["user"][0]["db_admission_table"][
            "db_special_concerns_table"
          ][0]["intervention"],
        admissionId:
          result["user"][0]["db_admission_table"][
            "db_special_concerns_table"
          ][0]["admission_id"],
        bucketName:
          result["user"][0]["db_admission_table"][
            "db_special_concerns_table"
          ][0]["supporting_documents"],
      };
    });

    const heards =
      result["user"][0]["db_admission_table"]["db_survey_table"][0][
        "heard_about_school"
      ].split(",");

    const factorsInfluences =
      result["user"][0]["db_admission_table"]["db_survey_table"][0][
        "factors_influencing_decision"
      ];

    const heardList = heards.split(",");
    const factorsInfluenceList = factorsInfluences.split(",");

    console.log(heardList, factorsInfluenceList);

    setSurveyData(() => {
      return {
        heardList: [...heardList],
        factorsInfluenceList: [...factorsInfluenceList],
      };
    });

    const handleRejectRequirements = () => {
      let rejectedFiles = [];
      rejectedFiles = admissions["admissionsArr"][dataIndex][
        "db_admission_table"
      ]["db_required_documents_table"].filter(
        (el) => el.document_status == "rejected"
      );
      const groupedFiles = rejectedFiles.reduce((acc, file) => {
        const type = file.requirement_type; // Assume this is the property holding the type
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(file.id); // Push the rejected file ID
        return acc;
      }, {});

      setRejectRequirementIds((prev) =>
        prev.map((item) => ({
          ...item,
          ids: groupedFiles[item.type] || item.ids, // Update only if the type matches
        }))
      );
    };
    handleRejectRequirements();
  };

  const handleSubmit = async () => {
    // e.preventDefault();

    setIsLoading(true);
    const response = await fetch(
      "https://donboscoapi.vercel.app/api/admission/register_admission",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "supabase-url": "https://srseiyeepchrklzxawsm.supabase.co/",
          "supabase-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2VpeWVlcGNocmtsenhhd3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5ODE2NjgsImV4cCI6MjAzMzU1NzY2OH0.WfcrXLHOj1aDt36XJ873SP8syg4I41rJgE_uV_X1vkU",
        },
        body: JSON.stringify({
          user_id: userId,
          level_applying: gradeLevel,
          fname: firstName,
          mname: middleName,
          lname: surname,
        }),
      }
    );

    getUserAdmissions(true);
    // setIsLoading(false);
    const result = await response.json();
    console.log(result);
    if (result["message"] === "Admission data found") {
      Swal.fire({
        title: "Duplicate Application found!",
        text: "Application has been connected to your account.",
        icon: "info",
      });
    } else if (result["message"] === "New admission record created") {
      Swal.fire({
        title: "Application created",
        text: "Please accomplish the requirements.",
        icon: "success",
      });
    }
    handleClose(); // Close the modal after submission
  };

  const updateSiblingsList = (e, i) => {
    setFamilyData((prevData) => ({
      ...prevData,
      siblings: prevData.siblings.map((sibling, index) =>
        index === i
          ? {
              ...sibling,
              [e.target.id]: e.target.value,
            }
          : sibling
      ),
    }));
  };

  const addApplicant = () => {
    setApplication((prev) => prev + 1);
    console.log(application);
  };

  const handleGGXApi = async () => {
    const response = await fetch(
      "https://api.lbcx.ph/v1/locations/countries/PH/provinces",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log(result);

    setProvinces(() => [
      ...result.data.map((province) => ({
        name: province["name"],
        id: province["id"],
      })),
    ]);
  };

  const clearApplicationFormData = () => {
    setPersonalData({
      levelApplyingFor: "",
      schoolYear: "",
      familyName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      age: "",
      sex: "",
      religion: "",
      otherCitizenship: "",
      otherReligion: "",
      citizenship: "",
      acrNumber: "",
      address: "",
      postalCode: "",
      contactNo: "",
      languages: "",
      usualCompanion: "",
    });
    setAcademicData({
      namePresentSchool: "",
      addressPresentSchool: "",
      presentSchoolContactNo: "",
      awardsHonor: "",
      escGrantee: "",
      currentGrade: "",
      currentSchoolYear: "",
    });

    setFamilyData({
      noOfSiblings: 0,
      siblings: [],
    });

    setFamily2Data({
      parentStatus: "",
      civilWedding: "",
      churchName: "",
      relationshipToChildGuardian: "",
      parentGuardian: [],
    });

    setFatherData({
      lastName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      age: "",
      educationAttainment: "",
      employmentStatus: "",
      employedAt: "",
      officeAddress: "",
      contactNo: "",
      position: "",
      salary: "",
    });

    setMotherData({
      lastName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      age: "",
      educationAttainment: "",
      employmentStatus: "",
      employedAt: "",
      officeAddress: "",
      contactNo: "",
      position: "",
      salary: "",
    });

    setGuardianData({
      background_id: "",
      lastName: "",
      firstName: "",
      middleName: "",
      dateOfBirth: "",
      age: "",
      educationAttainment: "",
      employmentStatus: "",
      employedAt: "",
      officeAddress: "",
      contactNo: "",
      position: "",
      salary: "",
    });

    setIsFather(false);
    setIsMother(false);
    setIsGuardian(false);

    setSpecialConcernsData({
      specialConcern: "",
      medicalCondition: "",
      medication: "",
      intervention: "",
      admissionId: "",
      bucketName: "",
    });

    setSurveyData({
      heardList: [],
      factorsInfluenceList: [],
    });

    setDob("");
    setAge("");
  };

  //original handleDobChange
  const handleDobChange = (e) => {
    // setIsLoading(true);
    if (personalData.dateOfBirth == null) return;
    console.log(e?.target.value);
    console.log(personalData.dateOfBirth);
    const selectedDate = new Date(personalData.dateOfBirth) ?? new Date(e.target.value);
    const today = new Date();

    // console.log(`DAA: ${selectedDate}`);

    if (selectedDate > today) {
      setAge("");
      handleDobChange();
      // return;
    }

    // Calculate age
    let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
    const monthDifference = today.getMonth() - selectedDate.getMonth();

    // Adjust for months not yet reached
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < selectedDate.getDate())
    ) {
      calculatedAge--;
    }

    console.log(`AGE: ${calculatedAge}`);
    setAge(calculatedAge >= 0 ? calculatedAge : "");

    if (calculatedAge < 0) {
      handleDobChange();
    }
    // setDob(e.target.value);
    // setIsLoading(false);
  };

  const handleDobChangeWrapper = (selectedDates) => {
    // If no date is selected, return early
    if (!selectedDates || selectedDates.length === 0) {
      console.error("No valid date selected.");
      setAge(""); // Clear the age
      return;
    }
  
    const selectedDate = selectedDates[0]; // Get the first selected date
    const today = new Date();
  
    // Check if the selected date is in the future
    if (selectedDate > today) {
      console.error("Selected date is in the future.");
      setAge(""); // Reset the age if the date is invalid
      return;
    }
  
    // Calculate the age based on the selected date
    let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
    const monthDifference = today.getMonth() - selectedDate.getMonth();
  
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < selectedDate.getDate())
    ) {
      calculatedAge--; // Adjust age if the current month/date is not yet reached
    }
  
    if (calculatedAge < 0) {
      console.error("Invalid age calculated.");
      setAge(""); // Reset the age if invalid
      return;
    }
  
    // Update the calculated age in the state
    setAge(calculatedAge);
  
    // Manually format the date as "YYYY-MM-DD"
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
  
    // Update the personal data's dateOfBirth field
    handleChange({ target: { id: "dateOfBirth", value: formattedDate } }, "personal");
  
    console.log(`Selected Date: ${formattedDate}`);
    console.log(`Age: ${calculatedAge}`);
  };
  
  
  
  


  /*const handleDobChange = (selectedDates) => {
    const selectedDate = selectedDates[0];
    const today = new Date();
  
    if (selectedDate > today) {
      setAge("");
      return;
    }
  
    let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
    const monthDifference = today.getMonth() - selectedDate.getMonth();
  
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < selectedDate.getDate())
    ) {
      calculatedAge--;
    }
  
    setAge(calculatedAge >= 0 ? calculatedAge : "");
  };*/
  

  const clearModalRegister = () => {
    setSurname("");
    setFirstName("");
    setMiddleName("");
    setGradeLevel("");
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

  const handleSessionToken = async (sessionToken) => {
    const decodedUser = await verifyToken(sessionToken);
    console.log(decodedUser);
    setUser(decodedUser);
  };


  useEffect(() => {
    if (user["registryType"] === "learner") {
      setSurname(user["lastName"]);
      setFirstName(user["firstName"]); // Synchronize state with user["firstName"]
      setMiddleName(user["middleName"]); // Synchronize state with user["firstName"]
    }

    // const formContainer = document.querySelector(".space-bet-form");
    // const formContainer2 = document.querySelector(".non-space-bet-form");
    // formContainer.scrollTo({
    //   top: 0,
    //   // left: 0,
    //   behavior: "instant",
    // });
    console.log(userId);
    handleSessionToken(sessionToken);
    getUserAdmissions(true);

    if (page == "personal-form") {
      // handleDobChange();
      handleGGXApi();
    } else if (page == "main") {
      setEdit(false);
      clearApplicationFormData();
      setRequirements([
        { type: "birthCert", file: [] },
        { type: "recentIdPhoto", file: [] },
        { type: "parentQuestionnaire", file: [] },
        { type: "baptismalCert", file: [] },
        { type: "communionCert", file: [] },
        { type: "marriageCert", file: [] },
        { type: "recoLetter", file: [] },
        { type: "reportPreviousCard", file: [] },
        { type: "reportPresentCard", file: [] },
        { type: "nonCatholicWaiver", file: [] },
        { type: "alienCert", file: [] },
        { type: "passport", file: [] },
      ]);
      setScheduleDetails({
        scheduleId: "",
        timeStart: "",
        timeEnd: "",
        location: "",
        date: "",
      });
    }
  }, [
    page,
    personalData.dateOfBirth,
    fatherData.dateOfBirth,
    motherData.dateOfBirth,
    guardianData.dateOfBirth,
  ]);

  const renderContent = () => {
    {
      isLoading ? (
        <ReactLoading className="app-loader" type={"bubbles"} color="#012169" />
      ) : null;
    }
    switch (page) {
      case "main":
        // console.log();
        return (
          <>
            {isResultSent ? (
              <Modal show={showResultModal} id="modal-container" centered>
                {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
                <Modal.Body>
                  <div className="payment-box">
                    {/* <img src={wallet} className="logo-verification" /> */}
                    <h1>Assessment Results:</h1>
                    <h2>
                      Remarks:{" "}
                      <strong style={{ color: isPassed ? "green" : "#c8102e" }}>
                        {admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]?.["admission_status"]}
                      </strong>
                    </h2>
                    <hr />
                    
                      <>
                        <hr />
                        <h3>
                        <a
                                                id="view-upload"
                                                href={admissions["admissionsArr"][dataIndex]["db_admission_table"]['result_doc']}  // Use the first URL in the array for the href
                                              
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                  e.preventDefault(); // Prevent the default link behavior
                                              
                                                  // If `el.document_url` is a string, split it by commas to get an array of URLs
                                                  const urls = typeof admissions["admissionsArr"][dataIndex]["db_admission_table"]['result_doc'] === 'string'
                                                    ? admissions["admissionsArr"][dataIndex]["db_admission_table"]['result_doc'].split(',').map(url => url.trim()) // Split and trim URLs
                                                    : Array.isArray(admissions["admissionsArr"][dataIndex]["db_admission_table"]['result_doc'])
                                                    ? admissions["admissionsArr"][dataIndex]["db_admission_table"]['result_doc'] // If already an array, use it directly
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
                                                style={{ color: "#012169", textDecoration: "underline" }}
                                            >
                                             Download Assessment Result
                                            </a></h3>
                      </>
                    

                    {/* <hr className="payment-line" /> */}
                    {/* <h2>{formData.email}</h2> */}

                    <hr className="line-container" />
                    <button
                      className="btn btn-blue"
                      onClick={() => {
                        setShowResultModal(false);
                        // setPage("main");
                      }}
                    >
                      Ok, got it!
                    </button>
                  </div>
                </Modal.Body>
              </Modal>
            ) : null}


{preEnrollmentStatus == 'paid' ? (
              <Modal show={showRequirementsModal} id="modal-container" centered>
                {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
                <Modal.Body>
                  <div className="payment-box">
                    {/* <img src={wallet} className="logo-verification" /> */}
                    <h1>Assessment Results:</h1>
                    <h2>
                      Remarks:{" "}
                      <strong style={{ color: isPassed ? "green" : "red" }}>
                        {admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]?.["is_passed"]
                          ? "PASSED"
                          : "FAILED"}
                      </strong>
                    </h2>
                    <hr />
                    {isPassed ? (
                      <>
                        <h2>Pre Enrollment Requirements</h2>
                        <hr />
                        <h3>1x PSA Birth Certificate (Original Copy)</h3>
                        <h3>1x Report Card (Previous School)</h3>
                        {admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]["admission_status"] =='PROBATIONARY' && (<>
                        <h3>Probationary Contract</h3>
                        </>)}
                        <h3>
                          Please submit the pre requirements at the school.
                          Thank you!
                        </h3>
                      </>
                    ) : null}

                    {/* <hr className="payment-line" /> */}
                    {/* <h2>{formData.email}</h2> */}

                    <hr className="line-container" />
                    <button
                      className="btn btn-blue"
                      onClick={() => {
                        setRequirementsModal(false);
                        // setPage("main");
                      }}
                    >
                      Ok, got it!
                    </button>
                  </div>
                </Modal.Body>
              </Modal>
            ) : null}

            <div className="main-dashboard-container">
              <div className="mobile-app-bar">
                <img
                  src={logo}
                  className="logo-mobile
                "
                />
                <div className="welcome-text">
                  <h2>Welcome back!</h2>
                  <h3>1, {user["firstName"]}!</h3>
                </div>
              </div>
              <div className="main-header">
                <h1>Admission Application List</h1>
                {admissions["admissionsArr"].length > 0 &&
                user["registryType"] != "learner" ? (
                  <button
                    className="btn-blue btn btn-add"
                    onClick={() => {
                      handleShow();
                      handleSlotCheck();
                    }}
                    // onClick={() => setPage("personal-form")}
                  >
                    Add Application
                  </button>
                ) : null}
              </div>
            </div>

            {admissions["admissionsArr"].length > 0 ? (
              <div className="main-section mobile-main">
                <section className="applications-list-section">
                  <div className="applicant-list">
                    {Array.from({
                      length: admissions["admissionsArr"].length,
                    }).map((_, i) => (
                      <ApplicantCard
                        status={
                          admissions["admissionsArr"][i]["db_admission_table"][
                            "admission_status"
                          ]
                        }
                        selectedId={admissionSelected}
                        name={`${admissions["admissionsArr"][i]["db_admission_table"]["first_name"]} ${admissions["admissionsArr"][i]["db_admission_table"]["last_name"]}`}
                        applicationId={`${admissions["admissionsArr"][i]["db_admission_table"]["admission_form_id"]}`}
                        key={i}
                        setLoading={setIsLoading}
                        backgroundId={`${
                          admissions["admissionsArr"][i]["db_admission_table"][
                            "db_family_background_table"
                          ].length > 0
                            ? admissions["admissionsArr"][i][
                                "db_admission_table"
                              ]["db_family_background_table"]?.[0][
                                "background_id"
                              ]
                            : ""
                        }`}
                        admissionId={`${admissions["admissionsArr"][i]["admission_id"]}`}
                        admissionData={admissions["admissionsArr"][i]}
                        selectApplicationId={handleSelectId}
                        handleUserAdmission={getUserAdmissions}
                        getAdmissionData={getAdmissionData}
                        getLengthRequirements={getLengthRequirements}
                        index={i}
                        handleDataIndex={setDataIndex}
                        handleSelectedAdmission={setAdmissionSelected}
                        clearFiles={handleClearItems}
                      />
                    ))}
                  </div>
                </section>
                {admissionSelected ? (
                  <section className="status-tracking-section"  style={toPreEnrollment ? { height: "80vh", overflowY: "scroll" , marginBottom: "40px"} : {}}>
                    <div className="tracking-section">
                      <div>
                        <h4 className="admission-step-ls">Registration</h4>
                        <h4 className="admission-step-ls">Application</h4>
                        <h4 className="admission-step-ls">Upload</h4>
                        <h4 className="admission-step-ls">Payment</h4>
                        <h4 className="admission-step-ls">Assessment</h4>
                        <h4 className="admission-step-ls">Results</h4>
                        {toPreEnrollment && (
                        <>
                        <h4 className="admission-step-ls">Payment</h4>
                        <h4 className="admission-step-ls">Submit</h4>
                        </>)}
                      </div>
                    </div>
                    <StatusTracker
                      isAssessmentPending={isAssessmentPending}
                      isApplicationPending={isApplicationPending}
                      isApplicationComplete={isApplicationComplete}
                      isUploadRejected={isUploadRejected}
                      isUploadPending={isUploadPending}
                      isUploadComplete={isUploadComplete}
                      isPaymentPending={isPaymentPending}
                      isPaymentComplete={isPaymentComplete}
                      isAssessmentSelected={isAssessmentSelected}
                      isPendingAssessment={isPendingAssessment}
                      isResultSent={isResultSent}
                      isPassed={isPassed}
                      isApplicationCreated={
                        admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]["is_application_created"]
                      }
                      isUploadCreated={
                        admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]["is_all_required_file_uploaded"]
                      }
                      isAssessmentAttended={isAssessmentAttended}
                      toPreEnrollment={toPreEnrollment}
                      preEnrollmentStatus={preEnrollmentStatus}
                      toPreRequirement={toPreRequirement}
                    />
                    <div className="tracking-desc-section">
                      <div className="desc-steps">
                        <div
                          className="admission-step desc-step"
                          style={{ color: "#aaa" }}
                        >
                          <span>Register in the Admission Portal</span>
                          <span className="desc-subtext">
                            admissionportal-cdbs.vercel.app
                          </span>
                        </div>
                        <div
                          className="admission-step desc-step desc-step-succ"
                          style={{ color: isApplicationComplete ? "#aaa" : "" }}
                          onClick={() => {
                            if (
                              (admissions["admissionsArr"][dataIndex][
                                "db_admission_table"
                              ]["is_application_created"] &&
                                admissions["admissionsArr"][dataIndex][
                                  "db_admission_table"
                                ]["admission_status"] == "in review") ||
                              admissions["admissionsArr"][dataIndex][
                                "db_admission_table"
                              ]["admission_status"] == "complete" ||
                              admissions["admissionsArr"][dataIndex][
                                "db_admission_table"
                              ]["is_complete_view"]
                              // ) {
                            ) {
                              return;
                            }
                            setPage("agreement-declaration");
                            getAdmissionData();

                            // console.log(
                            //   admissions["admissionsArr"][dataIndex][
                            //     "db_admission_table"
                            //   ]["religion"]
                            // );
                          }}
                        >
                          <span>Fill-out Online Application Form</span>

                          <span className="desc-subtext">
                            View Application Form
                          </span>
                        </div>
                        <h4
                          style={{ color: isUploadComplete ? "#aaa" : "" }}
                          className="admission-step desc-step desc-step-succ"
                          onClick={() => {
                            if (!isApplicationPending && isUploadComplete) {
                              return;
                            }
                            setPage("upload");
                            if (isUploadPending || isUploadRejected) {
                              setEdit(() => true);
                            }
                            getLengthRequirements();
                          }}
                        >
                          Upload Requirements
                        </h4>
                        <h4
                          style={{ color: isPaymentComplete ? "#aaa" : "" }}
                          className="admission-step desc-step desc-step-succ"
                          onClick={() => {
                            if (!isUploadComplete) {
                              return;
                            }
                            setPage("payment");
                          }}
                        >
                          Pay Admission Fee
                        </h4>
                        <h4
                          className="admission-step desc-step desc-step-succ"
                          style={{ color: isAssessmentSelected ? "#aaa" : "" }}
                          onClick={async () => {
                            if (!isPaymentComplete) return;
                            if (isResultSent) return;
                            await getSchedules(
                              admissions["admissionsArr"][dataIndex][
                                "db_admission_table"
                              ]["level_applying_for"]
                            );
                            setPage("calendar");
                          }}
                        >
                          Select Schedule and Assessment Exam
                        </h4>
                        <h4 className={`admission-step desc-step desc-step-succ ${
                              !toPreEnrollment ? "last-step" : ""
                            }`}
                            style={{ color: isResultSent ? "#aaa" : "" }}
                          >

                          {/*isResultSent
                            ? "Results available"
                            : "Wait for Results"*/}
                          Assessment Result

                          {isResultSent ? (
                            <span
                              onClick={() => {
                                console.log("clicked");
                                setShowResultModal(true);
                              }}
                              className="results-requirements"
                            >
                              View Results
                            </span>
                          ) : null}
                        </h4>
                        {toPreEnrollment && (
                        <>
                          <h4
                          style={{ color: preEnrollmentStatus=='paid' ? "#aaa" : "" }}
                          className="admission-step desc-step desc-step-succ"
                          onClick={() => {
                            if (preEnrollmentStatus != 'paid' ) {
                              setPage("pre-enrollment");
                            }else{
                              return;
                            }
                          }}
                          >
                            Pay Reservation Fee
                            {preEnrollmentStatus == 'paid' ? (
                            <span
                              onClick={() => {
                                console.log("clicked");
                                setRequirementsModal(true);
                              }}
                              className="results-requirements"
                            >
                              View Pre-Enrollment Requirements
                            </span>
                          ) : null}
                          </h4>

                          <h4
                          style={{ color: toPreRequirement ? "#aaa" : "" }}
                          className="admission-step desc-step desc-step-succ last-step" 
                          >
                            Submit Hard Copy of Requirements
                            
                          </h4>
                        </>)}
                        
                      </div>
                    </div>
                    
                  </section>
                ) : null}
              </div>
              
            ) : (
              <div className="center-main">
                <div className="no-applications-container">
                  <p>No applications yet?</p>
                  <p className="no-application-sub-text">
                    Please click &quot;Add Applicant&quot; to add an applicant
                  </p>
                </div>

                <div
                  className="btn-blue btn btn-add btn-applicant"
                  onClick={() => {
                    handleShow();
                    handleSlotCheck();
                  }}
                >
                  Add Applicant
                </div>
                
              </div>
              
            )}
            
            <div className='main-section mobile-main' style={{
    borderBottom: 'none', // Remove border
    boxShadow: 'none',    // Remove shadow
    textDecoration: 'none', // Remove underline
  }}
>
              <section className="applicant-list-section"></section>
              <section className="status-list-section">
                {//<StatusCircles />
                }
              </section>
            </div>
          </>
        );

      case "personal-form":
        return (
          <>
            <div className="main-dashboard-container">
              <div className="main-header form-header">
                <span
                  onClick={() => {
                    setPage("agreement-declaration");
                  }}
                >
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                console.log(`FAMILY: ${JSON.stringify(family2Data)}`);
                handlePersonalSubmission();
                personalData.levelApplyingFor === "Kinder" ||
                personalData.levelApplyingFor === "Pre-Kinder"
                  ? setPage("family-form")
                  : setPage("academic-form");
              }}
            >
              <div className="space-bet-form">
                <div className="form-container">
                  <h3 className="form-heading">Personal Data</h3>
                  <h4 className="form-sub-header">
                    Please enter <span>Learner Information</span>
                  </h4>{" "}
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form">Level applying for:</p>
                      <select
                        id="levelApplyingFor"
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        value={personalData.levelApplyingFor}
                        className="form-select"
                        required
                      >
                        <option value="" disabled>
                          Please select grade level
                        </option>
                        <option value="Pre-Kinder">Pre-kindergarten</option>
                        <option value="Kinder">Kindergarten</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>
                    <div className="form-col">
                      <p className="label-form">School Year:</p>
                      <input
                        id="schoolYear"
                        onSubmit={(e) => handleChange(e, "personal")}
                        value="2025-2026"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9-]/g,
                            ""
                          );
                        }}
                        onChange={(e) => {
                          const validatedValue = e.target.value.replace(
                            /[^0-9-]/g,
                            ""
                          );
                          handleChange(e, "personal"); // Call your original function
                          e.target.value = validatedValue; // Update the input value
                        }}
                        type="text"
                        className="form-textfield form-control"
                        placeholder="School year"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label htmlFor="familyName" className="label-form">
                        Full Name*
                      </label>
                      <input
                        id="familyName"
                        value={personalData.familyName}
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="Family Name"
                        required
                      />
                    </div>
                    <div className="form-col">
                      <p className="label-form colorless">Full Name*</p>
                      <input
                        value={personalData.firstName}
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        id="firstName"
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-col">
                      <p className="label-form colorless">. </p>
                      <input
                        value={personalData.middleName}
                        id="middleName"
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="Middle Name"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    {/*<div className="form-col">
                      <label htmlFor="dateOfBirth" className="label-form">
                        Date of Birth*
                      </label>
                      <input
                        onChange={(e) => {
                          handleDobChange();
                          handleChange(e, "personal");
                        }}
                        // onChange={(e) => {

                        // 
                        max={today}
                        value={personalData.dateOfBirth}
                        id="dateOfBirth"
                        type="date"
                        className="form-textfield third-occ form-control"
                        placeholder="Calendar"
                        required
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </div>*/}
                    <div className="form-col">
                      <label htmlFor="dateOfBirth" className="label-form">
                        Date of Birth*
                      </label>
                      <Flatpickr
                        data-enable-time={false}
                        options={{
                          maxDate: maxDate, // Disable future dates
                          disableMobile: true, // Use Flatpickr even on mobile devices
                          dateFormat: "Y-m-d", // Display format: YYYY-MM-DD
                          clear:true,
                          yearSelectorType: "dropdown",
                        }}
                        placeholder="Date of Birth"
                        id="dateOfBirth"
                        value={personalData.dateOfBirth || undefined} // Ensure proper value format
                        onChange={handleDobChangeWrapper}
                        onOpen={() => {
                          handleChange({ target: { id: "dateOfBirth", value: null } }, "personal");
                          setAge(0); // Reset age to 0 when the picker is opened
                        }}
                        className="form-textfield third-occ form-control"
                      />
                    </div>


                    <div className="form-col">
                      <p className="label-form">Place of Birth*</p>
                      <input
                        id="placeOfBirth"
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        value={personalData.placeOfBirth}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="Place of Birth"
                        required
                      />
                    </div>
                    <div className="form-col">
                      <p className="label-form ">Age*</p>
                      <input
                        value={age}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="Age"
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label htmlFor="sex" className="label-form">
                        Sex*
                      </label>
                      <select
                        id="sex"
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        value={personalData.sex}
                        className="form-select"
                        required
                      >
                        <option value="" disabled>
                          Please select sex
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-col">
                      <p className="label-form">Religion*</p>
                      {/* <input
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        id="religion"
                        value={personalData.religion}
                        type="text"
                        className="form-textfield third-occ form-select"
                        placeholder="Religion"
                        required
                      /> */}
                      <select
                        id="religion"
                        // onSubmit={(e) => {
                        //   handleChange(e, "personal");
                        // }}
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        value={personalData.religion}
                        className="form-select"
                        required
                      >
                        <option value="" disabled>
                          Please select religion
                        </option>

                        <option value="Roman Catholic">Roman Catholic</option>
                        <option value="Islam">Islam</option>
                        <option value="Seventh-Day Adventist">
                          Seventh-Day Adventist
                        </option>
                        <option value="Iglesia ni Cristo">
                          Iglesia ni Cristo
                        </option>
                        <option value="Philippine Independent Church">
                          Philippine Independent Church
                        </option>
                        <option value="Bible Baptist Church">
                          Bible Baptist Church
                        </option>
                        <option value="United Church of Christ in the Philippines">
                          United Church of Christ in the Philippines
                        </option>
                        <option value="Jehovah's Witnesses">
                          Jehovah&apos;s Witnesses
                        </option>
                        <option value="Church of Christ">
                          Church of Christ
                        </option>

                        <option value="Born Again Christian">
                          Born Again Christian
                        </option>
                        <option value="Buddhism">Buddhism</option>
                        <option value="No Religion">No Religion</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    {personalData.religion == "Others" ? (
                      <>
                        <div className="form-col">
                          <label htmlFor="languages" className="label-form">
                            Other religion, please specify
                          </label>
                          <input
                            onChange={(e) => {
                              handleChange(e, "personal");
                            }}
                            value={personalData.otherReligion}
                            id="otherReligion"
                            type="text"
                            className="form-textfield third-occ form-control"
                            placeholder="Please specify religion"
                            required
                          />
                        </div>
                      </>
                    ) : null}
                    <div className="form-col">
                      <p className="label-form ">Citizenship*</p>
                      <select
                        id="citizenship"
                        // onSubmit={(e) => handleChange(e, "citizenship")}
                        onChange={(e) => handleChange(e, "personal")}
                        value={personalData.citizenship}
                        className="form-select"
                        required
                      >
                        <option value="" disabled>
                          Select citizenship
                        </option>
                        {nationalities.map((nationality) => (
                          <option key={nationality} value={nationality}>
                            {nationality}
                          </option>
                        ))}
                      </select>
                    </div>
                    {personalData.citizenship == "Others" ? (
                      <>
                        <div className="form-col">
                          <label htmlFor="languages" className="label-form">
                            Other citizenship, please specify
                          </label>
                          <input
                            onChange={(e) => {
                              handleChange(e, "personal");
                            }}
                            value={personalData.otherCitizenship}
                            id="otherCitizenship"
                            type="text"
                            className="form-textfield third-occ form-control"
                            placeholder="Please specify citizenship"
                            required
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="form-col">
                    <p className="label-form ">
                      ACR Number (For Foreign Learners Only)
                    </p>
                    <input
                      onChange={(e) => {
                        handleChange(e, "personal");
                      }}
                      id="acrNumber"
                      value={personalData.acrNumber}
                      type="text"
                      className="form-textfield third-occ form-control"
                      placeholder="ACR Number"
                    />
                  </div>
                  <div className="form-col">
                    <p className="label-form ">Address*</p>
                    <div className="form-row">
                      <input
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        id="address"
                        value={personalData.address}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="House No., Street, Subdivision"
                        required
                      />
                      <select
                        id="province"
                        onChange={(e) => {
                          console.log(e.target);
                          handleChange(
                            {
                              target: {
                                value: e.target.textContent,
                                id: "province",
                              },
                            },
                            "personal"
                          );
                          setBaranggays(() => []);
                          setSelectedIdProvince(e.target.value);
                          handleFetchCities(e.target.value);
                          handleChange(e, "personal");

                          handleChange(
                            {
                              target: {
                                value: "",
                                id: "city",
                              },
                            },
                            "personal"
                          );
                        }}
                        className="form-select"
                        value={personalData.province}
                        required
                      >
                        <option value="" disabled>
                          Please select province
                        </option>
                        {provinces.map((el) => (
                          <option value={el["id"]} key={el["id"]}>
                            {el["name"]}
                          </option>
                        ))}
                      </select>
                      <select
                        id="city"
                        className="form-select"
                        value={personalData.city}
                        required
                        onChange={(e) => {
                          console.log(e.target.value);
                          handleChange(
                            {
                              target: {
                                value: e.target.textContent,
                                id: "city",
                              },
                            },
                            "personal"
                          );
                          setSelectedIdProvince(e.target.value);
                          handleFetchBaranggays(e.target.value);
                          handleChange(e, "personal");

                          handleChange(
                            {
                              target: {
                                value: "",
                                id: "baranggay",
                              },
                            },
                            "personal"
                          );
                        }}
                      >
                        <option value="" disabled>
                          Please select city
                        </option>
                        {cities.map((el) => (
                          <option value={el["id"]} key={el["id"]}>
                            {el["name"]}
                          </option>
                        ))}
                      </select>
                      <select
                        id="baranggay"
                        className="form-select"
                        value={personalData.baranggay}
                        required
                        onChange={(e) => {
                          console.log(e.target.value);

                          handleChange(
                            {
                              target: {
                                value: e.target.value,
                                id: "baranggay",
                              },
                            },
                            "personal"
                          );
                          handleChange(e, "personal");
                        }}
                      >
                        <option value="" disabled>
                          Please select barangay
                        </option>
                        {baranggays.map((el) => (
                          <option value={el["id"]} key={el["id"]}>
                            {el["name"]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    {/* <div className="form-col">
                      <label htmlFor="name" className="label-form">
                        Zip/Postal Code*
                      </label>
                      <input
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        value={personalData.postalCode}
                        id="postalCode"
                        type="postal"
                        className="form-textfield third-occ form-control"
                        placeholder="Postal Code"
                        required
                      />
                    </div> */}
                    <div className="form-col">
                      <p className="label-form">Contact No.*</p>
                      <input
                        maxLength={11}
                        onInput={(e) => {
                          const input = e.target.value.replace(/[^0-9]/g, "");
                          e.target.value = input;
                          // Allow only digits
                          if (input.length <= 11 || input.length >= 8) {
                            handleChange(e, "personal"); // Pass valid input to your handler
                          }
                        }}
                        onBlur={(e) => {
                          const input = e.target.value.replace(/[^0-9]/g, "");

                          if (input.length !== 11 && input.length !== 8) {
                            alert(
                              "Contact number must be either 8 or 11 digits."
                            ); // Optional: Add custom error message
                            e.target.value = ""; // Reset input
                            handleChange(e, "personal"); // Clear value in the state
                          }
                        }}
                        id="contactNo"
                        value={personalData.contactNo}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="Contact Number"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label htmlFor="languages" className="label-form">
                        Languages/Dialects Spoken*
                      </label>
                      <input
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        value={personalData.languages}
                        id="languages"
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="ex: Filipino, English..."
                        required
                      />
                    </div>
                    <div className="form-col">
                      <p className="label-form">
                        Usual Companion at Home (Name and Relationship):*
                      </p>
                      <input
                        onChange={(e) => {
                          handleChange(e, "personal");
                        }}
                        id="usualCompanion"
                        value={personalData.usualCompanion}
                        type="text"
                        className="form-textfield third-occ form-control"
                        placeholder="Name of Companion"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-container">
                  {/* <input className="btn-blue next-btn btn" type="submit" /> */}

                  <button
                    type="submit"
                    className="btn-blue next-btn btn-submit"
                    // onClick={() => {
                    //   personalData.levelApplyingFor === "Kinder"
                    //     ? setPage("family-form")
                    //     : setPage("academic-form");
                    //   handlePersonalSubmission();
                    // }}
                  >
                    Next
                  </button>
                </div>

                <div className="saved-container colorless">
                  {/* <img src={check} /> */}
                  <p className="saved-text sticky">Saved just now</p>
                </div>
              </div>
            </form>
          </>
        );

      case "academic-form":
        return (
          <>
            <div className="main-dashboard-container">
              <div className="main-header form-header">
                <span onClick={() => setPage("personal-form")}>
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleAcademicSubmission();
                setPage("family-form");
              }}
            >
              <div className="space-bet-form">
                <div className="form-container">
                  <h3 className="form-heading">Academic Background</h3>
                  <h4 className="form-sub-header">
                    Please enter <span>Previous Academic Information</span>
                  </h4>{" "}
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form">Name of Present School:*</p>
                      <input
                        id="namePresentSchool"
                        onChange={(e) => {
                          handleChange(e, "academic");
                        }}
                        value={academicData.namePresentSchool}
                        type="text"
                        className="form-textfield form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form">Address of Present School:*</p>
                      <input
                        id="addressPresentSchool"
                        onChange={(e) => {
                          handleChange(e, "academic");
                        }}
                        value={academicData.addressPresentSchool}
                        type="text"
                        className="form-textfield form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label htmlFor="name" className="label-form">
                        Contact No.*
                      </label>
                      <input
                        maxLength={11}
                        onInput={(e) => {
                          const input = e.target.value.replace(/[^0-9]/g, "");
                          e.target.value = input;
                          // Allow only digits
                          if (input.length <= 11 || input.length >= 8) {
                            handleChange(e, "academic"); // Pass valid input to your handler
                          }
                        }}
                        onBlur={(e) => {
                          const input = e.target.value.replace(/[^0-9]/g, "");
                          if (input.length !== 11 && input.length !== 8) {
                            alert(
                              "Contact number must be either 8 or 11 digits."
                            ); // Optional: Add custom error message
                            e.target.value = ""; // Reset input
                            handleChange(e, "academic"); // Clear value in the state
                          }
                        }}
                        // onInput={(e) => {
                        //   e.target.value = e.target.value.replace(
                        //     /[^0-9]/g,
                        //     ""
                        //   ); // Allow only digits
                        //   handleChange(e, "academic");
                        // }}
                        value={academicData.presentSchoolContactNo}
                        id="presentSchoolContactNo"
                        type="text"
                        className="form-textfield third-occ form-control"
                        required
                      />
                    </div>
                    <div className="form-col">
                      <p className="label-form">Current Grade Level*</p>
                      <select
                        id="currentGrade"
                        className="form-select"
                        value={academicData.currentGrade}
                        onChange={(e) => {
                          handleChange(e, "academic");
                        }}
                        required
                      >
                        <option value="" disabled>
                          Please select grade level
                        </option>
                        <option value="Pre-Kinder">Pre-kindergarten</option>
                        <option value="Kinder">Kindergarten</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>
                    <div className="form-col">
                      <p className="label-form ">School Year*</p>
                      
                      <select
                        onChange={(e) => {
                          handleChange(e, "academic");
                        }}
                        value={academicData.currentSchoolYear}
                        id="currentSchoolYear"
                        className="form-textfield third-occ form-control"
                        placeholder="School Year"
                        required
                      >
                        <option value="" disabled>
                          Select School Year
                        </option>
                        {Array.from({ length: 2024 - 2010 + 1 }, (_, i) => {
                          const startYear = 2010 + i;
                          const endYear = startYear + 1;
                          const schoolYear = `${startYear}-${endYear}`;
                          return (
                            <option key={schoolYear} value={schoolYear}>
                              {schoolYear}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form">Awards/Honors Received</p>
                      <input
                        id="awardsHonor"
                        onChange={(e) => {
                          handleChange(e, "academic");
                        }}
                        value={academicData.awardsHonor}
                        type="text"
                        className="form-textfield form-control"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form">
                        {personalData.levelApplyingFor == "Grade 11"
                          ? "Senior High Voucher*"
                          : null}
                        {personalData.levelApplyingFor == "Grade 8" ||
                        personalData.levelApplyingFor == "Grade 9" ||
                        personalData.levelApplyingFor == "Grade 10"
                          ? "ESC Grantee?*"
                          : null}
                      </p>
                      {/* <input
                        id="escGrantee"
                        onChange={(e) => {
                          handleChange(e, "academic");
                        }}
                        value={academicData.escGrantee}
                        type="text"
                        className="form-textfield form-control"
                      /> */}
                      {personalData.levelApplyingFor == "Grade 8" ||
                      personalData.levelApplyingFor == "Grade 9" ||
                      personalData.levelApplyingFor == "Grade 10" ||
                      personalData.levelApplyingFor == "Grade 11" ? (
                        <select
                          id="escGrantee"
                          value={academicData.escGrantee}
                          className="form-select"
                          onChange={(e) => {
                            handleChange(e, "academic");
                          }}
                          required
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div id="btns" className="form-container ">
                  <div
                    className="back-btn"
                    onClick={() => setPage("personal-form")}
                  >
                    Back
                  </div>
                  <button
                    type="submit"
                    className="btn-blue next-btn btn-submit"
                    // onClick={() => {
                    //   personalData.levelApplyingFor === "Kinder"
                    //     ? setPage("family-form")
                    //     : setPage("academic-form");
                    //   handlePersonalSubmission();
                    // }}
                  >
                    Next
                  </button>
                </div>
                <div className="saved-container colorless">
                  {/* <img src={check} /> */}
                  <p className="saved-text sticky">Saved just now</p>
                </div>
              </div>
            </form>

            {/* <div className="saved-container">
              <img src={check} />
              <p className="saved-text sticky">Saved just now</p>
            </div> */}
          </>
        );

      case "family-form":
        return (
          <>
            {/* {console.log(familyData.noOfSiblings)} */}
            <div className="main-dashboard-container main-dashboard">
              <div className="main-header form-header">
                <span
                  onClick={() => {
                    personalData.levelApplyingFor === "Kinder" ||
                    personalData.levelApplyingFor === "Pre-Kinder"
                      ? setPage("personal-form")
                      : setPage("academic-form");
                  }}
                >
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage("family-form-2");
                handleFamilySubmission();
              }}
            >
              <div className="non-space-bet-form">
                <div className="form-container">
                  <h3 className="form-heading">Family Background</h3>
                  <h4 className="form-sub-header">
                    Please enter{" "}
                    <span>
                      Brother & Sisters Information in Chronological Order
                    </span>
                  </h4>{" "}
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form">Number of Siblings*</p>
                      <input
                        // onChange={(e) => {

                        // }}
                        id="noOfSiblings"
                        min={0}
                        max={25}
                        value={familyData.noOfSiblings}
                        type="number"
                        // required
                        className="form-control select-siblings"
                        onChange={(el) => {
                          const newSiblingData = {
                            siblingId: "",
                            siblingFamilyName: "",
                            siblingFirstName: "",
                            siblingMiddleName: "",
                            siblingDob: "",
                            siblingAge: "",
                            siblingOccupation: "",
                            siblingBusinessOffice: "",
                          };

                          setFamilyData((prevData) => {
                            const newNoOfSiblings = Number(el.target.value);
                            const currentNoOfSiblings = prevData.noOfSiblings;

                            let updatedSiblings;

                            if (newNoOfSiblings > currentNoOfSiblings) {
                              const additionalSiblings = Array(
                                newNoOfSiblings - currentNoOfSiblings
                              ).fill(newSiblingData);
                              updatedSiblings = [
                                ...prevData.siblings,
                                ...additionalSiblings,
                              ];
                            } else {
                              updatedSiblings = prevData.siblings.slice(
                                0,
                                newNoOfSiblings
                              );
                            }
                            handleChange(el, "family");
                            return {
                              ...prevData,
                              noOfSiblings: newNoOfSiblings,
                              siblings: updatedSiblings,
                            };
                          });
                        }}
                        // onInput={(e) => {
                        //   if (e.target.value < 0) e.target.value = 0;
                        //   if (e.target.value > 25) e.target.value = 25;
                        // }}
                        onInvalid={(e) =>
                          e.target.setCustomValidity(
                            "Value must be 0 or greater."
                          )
                        }
                        onKeyDown={(e) => {
                          // Allow: Backspace, Tab, Arrow keys, Delete, Enter
                          if (
                            [
                              "Backspace",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Delete",
                              "Enter",
                            ].includes(e.key)
                          ) {
                            return;
                          }

                          // Disallow anything that is not a number
                          if (!/^[0-9]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {/* <select className="form-select select-siblings">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select> */}
                      {/* const newSiblingData = {
                          siblingFamilyName: "",
                          siblingFirstName: "",
                          siblingMiddleName: "",
                          siblingDob: "",
                          siblingAge: "",
                          siblingOccupation: "",
                          siblingBusinessOffice: "",
                        }; */}
                      {familyData.siblings.length > 0
                        ? familyData.siblings.map((el, i) => (
                            <SiblingForm
                              lastName={el["siblingFamilyName"]}
                              firstName={el["siblingFirstName"]}
                              middleName={el["siblingMiddleName"]}
                              dateOfBirth={el["siblingDob"]}
                              age={el["siblingAge"]}
                              occupation={el["siblingOccupation"]}
                              office={el["siblingBusinessOffice"]}
                              key={i}
                              handleChange={(e) => {
                                handleChange(e, "family");
                                updateSiblingsList(e, i);
                              }}
                            />
                          ))
                        : null}
                    </div>
                  </div>
                  {/* <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">Awards/Honors Received</p>
                    <input type="text" className="form-textfield" />
                  </div>
                </div> */}
                  {/* <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">
                      Education System Contracting (ESC) Grantee
                    </p>
                    <input type="text" className="form-textfield" />
                  </div>
                </div> */}
                </div>

                <div id="btns-fam" className="form-container">
                  <div
                    className="back-btn"
                    onClick={() =>
                      personalData.levelApplyingFor === "Kinder" ||
                      personalData.levelApplyingFor === "Pre-Kinder"
                        ? setPage("personal-form")
                        : setPage("academic-form")
                    }
                  >
                    Back
                  </div>
                  <button
                    type="submit"
                    className="btn-blue next-btn btn-submit"
                    // onClick={() => {
                    //   personalData.levelApplyingFor === "Kinder"
                    //     ? setPage("family-form")
                    //     : setPage("academic-form");
                    //   handlePersonalSubmission();
                    // }}
                  >
                    Next
                  </button>
                  {/* <div
                    className="btn-blue next-btn"
                    onClick={() => {
                      setPage("family-form-2");
                      handleFamilySubmission();
                    }}
                  >
                    Next
                  </div> */}
                </div>
                <div className="saved-container colorless">
                  {/* <img src={check} /> */}
                  <p className="saved-text">Saved just now</p>
                </div>
              </div>
            </form>
          </>
        );

      case "family-form-2":
        return (
          <>
            <div className="main-dashboard-container main-dashboard">
              <div className="main-header form-header">
                <span onClick={() => setPage("family-form")}>
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isFather || isMother || isGuardian) {
                  setPage("special-concerns");
                  handleFamily2Submission();
                }
              }}
            >
              <div className="form-box">
                <div className="non-space-bet-form">
                  <div className="form-container">
                    <div>
                      <h3 className="form-heading">Family Background</h3>
                      <h4 className="form-sub-header">
                        Please enter <span>Parent/Guardian Information</span>
                      </h4>{" "}
                      <ParentGuardianForm
                        nameLabel={"Father's"}
                        parentGuardianObj={fatherData}
                        checked={isFather}
                        setChecked={setIsFather}
                        handleChange={handleChange}
                      />
                      <ParentGuardianForm
                        nameLabel={"Mother's Maiden"}
                        parentGuardianObj={motherData}
                        checked={isMother}
                        setChecked={setIsMother}
                        handleChange={handleChange}
                      />
                      <ParentGuardianForm
                        nameLabel={"Guardian's"}
                        parentGuardianObj={guardianData}
                        checked={isGuardian}
                        setChecked={setIsGuardian}
                        handleChange={handleChange}
                      />
                      {/* <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">Awards/Honors Received</p>
                    <input type="text" className="form-textfield" />
                  </div>
                </div> */}
                      {/* <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">
                      Education System Contracting (ESC) Grantee
                    </p>
                    <input type="text" className="form-textfield" />
                  </div>
                </div> */}
                      <div className="relationship-to-child-container">
                        {isGuardian ? (
                          <div className="form-row relationship-to-child">
                            <div className="form-col">
                              <label htmlFor="name" className="label-form">
                                Relationship to Learner (if guardian)*
                              </label>
                              <select
                                id="relationshipToChildGuardian"
                                className="form-select"
                                value={family2Data.relationshipToChildGuardian}
                                onChange={(event) => {
                                  // setFamily2Data(event.target.value);
                                  handleChange(event, "family2");
                                }}
                                required={isGuardian}
                              >
                                <option value="" disabled>
                                  Please select relationship
                                </option>
                                <option value={"Grandparent"}>
                                  Grandparent
                                </option>
                                <option value={"Relative"}>Relative</option>
                                <option value={"Sibling"}>Sibling</option>
                                <option value={"Other"}>Other</option>
                              </select>
                            </div>
                            {family2Data.relationshipToChildGuardian ==
                            "Other" ? (
                              <div className="form-col">
                                <label htmlFor="other" className="label-form">
                                  if Other*
                                </label>
                                <input
                                  id="relationshipToChildGuardian"
                                  // value={formData.other}
                                  // onChange={handleChange}
                                  type="text"
                                  className="form-textfield third-occ form-control"
                                  placeholder="Please specify"
                                  required
                                />
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="form-row">
                          <div className="form-col">
                            <p className="label-form">Parent Status*</p>
                            <select
                              id="parentStatus"
                              className="form-select"
                              value={family2Data.parentStatus}
                              onChange={(event) => {
                                // setFamily2Data(event.target.value);
                                handleChange(event, "family2");
                              }}
                              required={isFather || isMother}
                            >
                              <option value="" disabled>
                                Please select parent status
                              </option>
                              <option value={"Married"}>Married</option>
                              <option value={"Remarried"}>Remarried</option>
                              <option value={"Separated"}>Separated</option>
                              <option value={"Solo Parent"}>Solo Parent</option>
                              <option value={"Widowed"}>Widowed</option>
                              <option value={"Not Married"}>Not Married</option>
                            </select>
                          </div>
                        </div>
                        {family2Data.parentStatus == "Married" || family2Data.parentStatus == "Remarried"//||
                        //family2Data.parentStatus == "Separated" ||
                        //family2Data.parentStatus == "Widowed" ? 
                        ? (
                          <>
                            <div className="form-col">
                              <p className="label-form">Wedding Type*</p>
                              <select
                                id="civilWedding"
                                className="form-select"
                                value={family2Data.civilWedding}
                                onChange={(event) => {
                                  // setFamily2Data(event.target.value);
                                  handleChange(event, "family2");
                                }}
                                required={isFather || isMother}
                              >
                                <option value="" disabled>
                                  Please select parent status
                                </option>
                                <option value={"Civil"}>Civil</option>
                                <option value={"Church"}>Church</option>
                              </select>
                            </div>
                            <div className="form-row">
                              <div className="form-col">
                                <p className="label-form">
                                  {family2Data.civilWedding == "Church"
                                    ? "Church Name*"
                                    : family2Data.civilWedding == "Civil"
                                    ? "Civil Wedding Venue*"
                                    : ""}
                                </p>
                                <input
                                  onChange={(e) => handleChange(e, "family2")}
                                  id="churchName"
                                  value={family2Data.churchName}
                                  type="text"
                                  className="form-textfield form-control"
                                  required={isFather || isMother}
                                />
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="form-container form-family-2-container">
                    <div
                      className="back-btn"
                      onClick={() => setPage("family-form")}
                    >
                      Back
                    </div>

                    <button
                      type="submit"
                      className={`${
                        isFather || isMother || isGuardian
                          ? "btn-blue"
                          : "btn-grey"
                      } next-btn btn-submit`}
                      // onClick={() => {
                      //   personalData.levelApplyingFor === "Kinder"
                      //     ? setPage("family-form")
                      //     : setPage("academic-form");
                      //   handlePersonalSubmission();
                      // }}
                    >
                      Next
                    </button>
                    {/* <div
                  className="btn-blue next-btn"
                  onClick={() => {
                    setPage("special-concerns");
                    handleFamily2Submission();
                  }}
                >
                  Next
                </div> */}
                  </div>
                  <div className="saved-container colorless">
                    {/* <img src={check} /> */}
                    <p className="saved-text">Saved just now</p>
                  </div>
                </div>
              </div>
            </form>
          </>
        );

      case "special-concerns":
        return (
          <>
            <div className="main-dashboard-container main-dashboard">
              <div className="main-header form-header">
                <span onClick={() => setPage("family-form-2")}>
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                
                //setPage("survey");
                /*if(specialConcernsData.specialConcern !='' && specialConcernsData.medicalCondition!='' && specialConcernsData.medication!=''
                  && specialConcernsData.intervention!='' && specialFile.length >0
                ){
                  handleSpecialConcernSubmission();
                }*/
                //
              }}
            >
            <div className="space-bet-form">
              <div className="form-container">
                <h3 className="form-heading">Special Concerns</h3>
                <h4 className="form-sub-header">
                  Please enter{" "}
                  <span>Special Concern/s that might need attention</span>
                </h4>{" "}
                <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">Special Concerns</p>
                    <input
                      id="specialConcern"
                      onChange={(e) => {
                        handleChange(e, "specialConcerns");
                      }}
                      type="text"
                      className="form-textfield form-control"
                      value={specialConcernsData.specialConcern}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">
                      Medical/Development/Psychological Condition
                    </p>
                    <input
                      value={specialConcernsData.medicalCondition}
                      id="medicalCondition"
                      onChange={(e) => {
                        handleChange(e, "specialConcerns");
                      }}
                      type="text"
                      className="form-textfield form-control"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">Medication</p>
                    <input
                      id="medication"
                      value={specialConcernsData.medication}
                      onChange={(e) => {
                        handleChange(e, "specialConcerns");
                      }}
                      type="text"
                      className="form-textfield form-control"
                    />
                  </div>
                  <div className="form-col">
                    <p className="label-form">Intervention</p>
                    <input
                      id="intervention"
                      onChange={(e) => {
                        handleChange(e, "specialConcerns");
                      }}
                      value={specialConcernsData.intervention}
                      type="text"
                      className="form-textfield form-control"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">Attach Supporting Document</p>
                    <input
                      // value={specialConcernsData.bucketName}
                      type="file"
                      onChange={handleFileChange}
                      className="form-textfield form-control"
                      multiple
                      accept=".png, .jpeg, .jpg, .pdf"
                    />

                    {/* <button type="submit">Upload</button> */}
                  </div>
                </div>
                {filePreviews.length > 0 ? (
                  <div className="preview-container">
                    {filePreviews.map((file, index) => (
                      <div key={index} className="file-preview">
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            style={{
                              width: "150px",
                              height: "200px",
                              marginRight: "10px",
                            }}
                          />
                        ) : file.type === "pdf" ? (
                          <div
                            style={{
                              width: "150px",
                              height: "200px",
                              overflow: "hidden",
                              border: "1px solid #ddd",
                              position: "relative",
                            }}
                          >
                            <iframe
                              src={file.url}
                              title={file.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                border: "none",
                              }}
                            />
                          </div>
                        ) : (
                          <p>{file.name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
                {/* <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">Awards/Honors Received</p>
                    <input type="text" className="form-textfield" />
                  </div>
                </div> */}
                {/* <div className="form-row">
                  <div className="form-col">
                    <p className="label-form">
                      Education System Contracting (ESC) Grantee
                    </p>
                    <input type="text" className="form-textfield" />
                  </div>
                </div> */}
              </div>

              <div className="form-container">
                <div
                  className="back-btn"
                  onClick={() => setPage("family-form-2")}
                >
                  Back
                </div>
                <div
                  className="btn-blue next-btn"
                  onClick={async () => {
                    //handleSpecialConcernSubmission();
                    if(specialConcernsData.specialConcern !='' && specialConcernsData.medicalCondition!='' && specialConcernsData.medication!=''
                      && specialConcernsData.intervention!='' && specialFile.length >0
                    ){
                      handleSpecialConcernSubmission();
                    }
                    setPage("survey");
                  }}
                >
                  Next
                </div>
              </div>
              <div className="saved-container colorless">
                {/* <img src={check} /> */}
                <p className="saved-text">SAved just now</p>
              </div>
            </div>
            </form>
          </>
        );

      case "survey":
        return (
          <>
            <div className="main-dashboard-container main-dashboard">
              <div className="main-header form-header">
                <span onClick={() => setPage("family-form-2")}>
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  surveyData.heardList.length == 0 ||
                  surveyData.factorsInfluenceList.length == 0
                ) {
                  const obj = {
                    target: { id: "sample", value: "Others" },
                  };
                  handleChange(obj, "survey", "addFactors");
                  handleChange(obj, "survey", "addHeard");
                } else {
                  await handleAgreementDeclaration();
                  await handleSurveySubmission();
                  await Swal.fire({
                    title: "Good job!",
                    text: "Application created and saved",
                    icon: "success",
                    confirmButtonText: "Ok",
                  });
                  setPage("main");
                }
              }}
            >
              <div className="space-bet-form">
                <div className="form-container">
                  <h3 className="form-heading">Survey</h3>
                  <h4 className="form-sub-header">
                    Please <span>help us answer a quick survey</span>
                  </h4>{" "}
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form" style={{ color: "#222" }}>
                        How did you first hear about our school? (Select all
                        that apply)
                      </p>
                      <div className="checkbox-row">
                        <div className="checkbox-col">
                          <label style={{ color: "#222" }}>
                            <input
                              value="Online Search"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes(
                                "Online Search"
                              )}
                            />
                            <span className="option-check">
                              Online Search (Google, School Website, etc)
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Social Media"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes(
                                "Social Media"
                              )}
                            />
                            <span className="option-check">
                              Social Media (Facebook, Instagram, Youtube,
                              Tiktok)
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Word of Mouth"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes(
                                "Word of Mouth"
                              )}
                            />
                            <span className="option-check">
                              Word of Mouth (Friends, Family, Colleagues)
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="School events"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes(
                                "School events"
                              )}
                            />
                            <span className="option-check">
                              School Events or Open Houses
                            </span>
                          </label>
                        </div>
                        <div className="checkbox-col">
                          <label style={{ color: "#222" }}>
                            <input
                              value="Brochures"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes(
                                "Brochures"
                              )}
                            />
                            <span className="option-check">
                              Brochures/Flyers
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Education Fairs"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes(
                                "Education Fairs"
                              )}
                            />
                            <span className="option-check">
                              Education Fairs/Expos
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Ads"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes("Ads")}
                            />
                            <span className="option-check">
                              Local Advertisements (Newspapers, Billboards, etc)
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Others"
                              onChange={(e) => {
                                handleChange(e, "survey", "addHeard");
                              }}
                              type="checkbox"
                              checked={surveyData.heardList.includes("Others")}
                            />
                            <span className="option-check">
                              Others, please specify:{" "}
                              <input
                                type="text"
                                className="form-control"
                                readOnly={
                                  !surveyData.heardList.includes("Others")
                                }
                                required={surveyData.heardList.includes(
                                  "Others"
                                )}
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <p className="label-form" style={{ color: "#222" }}>
                        What factors influenced your decision to apply to our
                        school? (Select all that apply)
                      </p>
                      <div className="checkbox-row">
                        <div className="checkbox-col">
                          <label style={{ color: "#222" }}>
                            <input
                              value="Academic Reputation"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Academic Reputation"
                              )}
                            />
                            <span className="option-check">
                              Academic Reputation
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              // onClick={setSurveyData((prev)=>{
                              //   heardList: [...prev.heardList],
                              //   heardOthers:
                              // })}
                              value="Recommedation from friends and family"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Recommedation from friends and family"
                              )}
                            />
                            <span className="option-check">
                              Recommendation from Friends and Family
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Near location"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Near location"
                              )}
                            />
                            <span className="option-check">
                              Proximity to Home
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Extracurricular Activities"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Extracurricular Activities"
                              )}
                            />
                            <span className="option-check">
                              Extracurricular Activities Offered
                            </span>
                          </label>
                        </div>
                        <div className="checkbox-col">
                          <label style={{ color: "#222" }}>
                            <input
                              value="Reviews Online"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Reviews Online"
                              )}
                            />
                            <span className="option-check">
                              Positive Reviews Online
                            </span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Tuition Fee"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Tuition Fee"
                              )}
                            />
                            <span className="option-check">Tuition Fee</span>
                          </label>
                          <label style={{ color: "#222" }}>
                            <input
                              value="Others"
                              onChange={(e) => {
                                handleChange(e, "survey", "addFactors");
                              }}
                              type="checkbox"
                              checked={surveyData.factorsInfluenceList.includes(
                                "Others"
                              )}
                            />
                            <span className="option-check">
                              Others, please specify:{" "}
                              <input
                                onChange={(e) => {
                                  handleChange(e, "survey");
                                }}
                                type="text"
                                className="form-control"
                                readOnly={
                                  !surveyData.factorsInfluenceList.includes(
                                    "Others"
                                  )
                                }
                                required={surveyData.factorsInfluenceList.includes(
                                  "Others"
                                )}
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-container">
                  <div
                    className="back-btn"
                    onClick={() => setPage("special-concerns")}
                  >
                    Back
                  </div>
                  <button
                    type="submit"
                    className="btn-blue next-btn btn-submit"
                  >
                    Next
                  </button>
                  {/* <div
                    className="btn-blue next-btn"
                    onClick={() => {
                      {
                        // if (
                        //   surveyData.heardList.length == 0 ||
                        //   surveyData.factorsInfluenceList.length == 0
                        // ) {
                        //   const obj = {
                        //     target: { id: "sample", value: "Others" },
                        //   };
                        //   handleChange(obj, "survey", "addFactors");
                        //   handleChange(obj, "survey", "addHeard");
                        // } else {
                        //   setPage("agreement-declaration");
                        //   handleSurveySubmission();
                        // }
                      }
                    }}
                  >
                    Next
                  </div> */}
                  <div className="saved-container-2 colorless">
                    {/* <img src={check} /> */}
                    <p className="saved-text">SAved just now</p>
                  </div>
                </div>
              </div>
            </form>
          </>
        );

      case "agreement-declaration":
        return (
          <>
            <div className="main-dashboard-container main-dashboard">
              <div className="main-header form-header">
                <span
                  onClick={() => {
                    setPage("main");
                    clearApplicationFormData();
                  }}
                >
                  <img src={back} />
                </span>
                <h2 className="application-header-text">
                  Online Application Form
                </h2>
              </div>
              {/* <h3>
           Please enter <span>Learner Information</span>
          </h3> */}
            </div>

            <div className="main-con">
              <div className="space-bet-form">
                <div className="form-container">
                  <h3 className="form-heading" style={{ color: "#012169" }}>
                    Agreement
                  </h3>
                  <h4 className="form-sub-header">
                    The following statements{" "}
                    <span style={{ color: "#012169" }}>
                      must be read and agreed by both the Learner and the
                      Parent(s) or Guardian
                    </span>
                  </h4>{" "}
                  <p className="form-sub-header subhead">
                    We understand that this application and admission to
                    <span style={{ color: "#012169" }}>
                      {" "}
                      Caritas Don Bosco School
                    </span>{" "}
                    are subject to the following conditions:
                  </p>
                  <ol className="conditions-container">
                    <li>
                      {" "}
                      That we are responsible for the accuracy of all
                      information provided herein and we give consent for the
                      verification of the credentials submitted if necessary;
                    </li>
                    <li>
                      {" "}
                      That we provide an assessment/medical report of our child
                      if diagnosed with any medical, developmental and/or
                      psychological conditions that may affect his/her
                      performance in school;
                    </li>
                    <li>
                      {" "}
                      That any information withheld purposely or inadvertently
                      will mean forfeiture or cancellation of admission;
                    </li>
                    <li>
                      {" "}
                      That all credentials filed and received by the Registrar’s
                      Office become the property of Caritas Don Bosco School and
                      will not be returned to the applicant;
                    </li>
                    <li>
                      {" "}
                      That we understand that the result of the admission
                      test/procedure only reflects the final decision and the
                      school has the right not to disclose further details of
                      the test to protect the measuring tools being used;
                    </li>
                    <li>
                      {" "}
                      That no results will be released without submission of
                      complete admission requirements.
                    </li>
                  </ol>
                  <h3 className="form-heading" style={{ color: "#012169" }}>
                    Declaration
                  </h3>
                  <div className="checkbox-declaration">
                    <label>
                      <input
                        type="checkbox"
                        onChange={handleCheckboxChange}
                        checked={declarationPackage}
                      />
                      <span className="option-check">
                        We have read and understood all sections of this
                        admission package.
                      </span>
                    </label>
                  </div>
                  <div className="checkbox-declaration">
                    <label>
                      <input
                        type="checkbox"
                        onChange={handleSuppCheckboxChange}
                        checked={declarationSupportingDoc}
                      />
                      <span className="option-check">
                        We declare to the best of our knowledge, the information
                        provided in this application form and the supporting
                        documents are complete and accurate.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-container">
                  {/* <div className="back-btn" onClick={() => setPage("survey")}>
                    Back
                  </div> */}
                  <div
                    className={`${
                      !declarationPackage || !declarationSupportingDoc
                        ? "btn-grey"
                        : "btn-blue"
                    } next-btn`}
                    onClick={
                      !declarationPackage || !declarationSupportingDoc
                        ? null
                        : async () => {
                            //await handleAgreementDeclaration();

                            setPage("personal-form");
                            setSpecialFile(() => null);
                            setFilePreviews(() => []);
                          }
                    }
                  >
                    Continue
                  </div>
                  {/* <div className="saved-container-2 colorless"> */}
                  {/* <img src={check} /> */}
                  {/* <p className="saved-text">saved just now</p> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </>
        );

      case "upload":
        return (
          <>
            <div className="main-dashboard-container">
              <div className="main-header">
                <div className="main-text-head">
                  <div className="main-text-head">
                    <img src={back} onClick={() => setPage("main")} />
                    <h1>Upload Requirements</h1>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="header-text">List of Required Documents</h3>
            <div className="requirements-container">
              <Requirement
                fetchAdmissions={getUserAdmissions}
                handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                typeId={1}
                dataIndex={dataIndex}
                mainTitle={"Birth Certificate (PSA Copy)"}
                subTitle={"admin@caritasdonbosco.school"}
                fileText={"file_name.jpg/png/pdf"}
                requirements={requirements}
                handleRequirements={setRequirements}
                isRejected={requirementsRejectedArr.includes(1)}
                setDownloadedFiles={setDownloadedFiles}
                downloadedFiles={downloadedFiles}
              />
              <Requirement
                fetchAdmissions={getUserAdmissions}
                handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                typeId={2}
                dataIndex={dataIndex}
                mainTitle={"Recent ID Photo"}
                subTitle={"registrar@caritasdonbosco.school"}
                fileText={"file_name.jpg/png/pdf"}
                requirements={requirements}
                handleRequirements={setRequirements}
                isRejected={requirementsRejectedArr.includes(2)}
                setDownloadedFiles={setDownloadedFiles}
                downloadedFiles={downloadedFiles}
              />
              {admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "level_applying_for"
              ] == "Kinder" ||
              admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "level_applying_for"
              ] == "Pre-Kinder" ? (
                <>
                  <Requirement
                    handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                    fetchAdmissions={getUserAdmissions}
                    mainTitle={"Parent Questionnaire"}
                    subTitle={"(For Pre-kinder and Kinder applicants)*"}
                    typeId={4}
                    dataIndex={dataIndex}
                    fileText={"file_name.jpg/png/pdf"}
                    requirements={requirements}
                    handleRequirements={setRequirements}
                    isRejected={requirementsRejectedArr.includes(4)}
                    setDownloadedFiles={setDownloadedFiles}
                    downloadedFiles={downloadedFiles}
                  />
                </>
              ) : (
                <>
                  {admissions["admissionsArr"][dataIndex]["db_admission_table"][
                    "level_applying_for"
                  ] != "Grade 1" ? (
                    <Requirement
                      fetchAdmissions={getUserAdmissions}
                      handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                      mainTitle={"Previous Level Report Card"}
                      dataIndex={dataIndex}
                      subTitle={""}
                      typeId={3}
                      fileText={"file_name.jpg/png/pdf"}
                      requirements={requirements}
                      handleRequirements={setRequirements}
                      isRejected={requirementsRejectedArr.includes(3)}
                      setDownloadedFiles={setDownloadedFiles}
                      downloadedFiles={downloadedFiles} 
                    />
                  ) : null}
                  <Requirement
                    fetchAdmissions={getUserAdmissions}
                    handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                    mainTitle={"Present Level Report Card"}
                    dataIndex={dataIndex}
                    subTitle={""}
                    typeId={14}
                    fileText={"file_name.jpg/png/pdf"}
                    requirements={requirements}
                    handleRequirements={setRequirements}
                    isRejected={requirementsRejectedArr.includes(14)}
                    setDownloadedFiles={setDownloadedFiles}
                    downloadedFiles={downloadedFiles} 
                  />
                  <Requirement
                    fetchAdmissions={getUserAdmissions}
                    handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                    mainTitle={"Recommendation Letter"}
                    subTitle={""}
                    dataIndex={dataIndex}
                    fileText={"file_name.jpg/png/pdf"}
                    requirements={requirements}
                    handleRequirements={setRequirements}
                    setDownloadedFiles={setDownloadedFiles}
                    downloadedFiles={downloadedFiles} 
                  />
                </>
              )}

              {admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "religion"
              ] != "Roman Catholic" ? (
                <Requirement
                  fetchAdmissions={getUserAdmissions}
                  handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                  mainTitle={"Non-Catholic Waiver"}
                  subTitle={""}
                  dataIndex={dataIndex}
                  typeId={13}
                  fileText={"file_name.jpg/png/pdf"}
                  requirements={requirements}
                  handleRequirements={setRequirements}
                  isRejected={requirementsRejectedArr.includes(13)}
                  setDownloadedFiles={setDownloadedFiles}
                  downloadedFiles={downloadedFiles} 
                />
              ) : null}
              {admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "citizenship"
              ] != "Filipino" ? (
                <>
                  <Requirement
                    fetchAdmissions={getUserAdmissions}
                    handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                    mainTitle={"Alien Certificate of Registration"}
                    subTitle={""}
                    dataIndex={dataIndex}
                    typeId={11}
                    fileText={"file_name.jpg/png/pdf"}
                    requirements={requirements}
                    handleRequirements={setRequirements}
                    isRejected={requirementsRejectedArr.includes(11)}
                    setDownloadedFiles={setDownloadedFiles}
                    downloadedFiles={downloadedFiles} 
                  />
                  <Requirement
                    fetchAdmissions={getUserAdmissions}
                    handleDeleteUploadedFiles={handleDeleteUploadedFiles}
                    mainTitle={"Photocopy of Passport or Visa"}
                    subTitle={""}
                    dataIndex={dataIndex}
                    typeId={12}
                    fileText={"file_name.jpg/png/pdf"}
                    requirements={requirements}
                    handleRequirements={setRequirements}
                    isRejected={requirementsRejectedArr.includes(12)}
                    setDownloadedFiles={setDownloadedFiles}
                    downloadedFiles={downloadedFiles} 
                  />
                </>
              ) : null}
            </div>
            <div className="upload-btn-container">
              {
              
              edit ? (
                
                <button
                  className={`${ requirements.filter((el) => el.file.length > 0).length == 0
                      ? "btn-grey"
                      : "btn-blue"
                  } btn btn-add upload-btn`}
                  onClick={() => {
                    if (areRequiredFilesDownloaded()) {
                      handleUpload(requirements);
                    } else {
                      Swal.fire({
                        title: "Required files not downloaded",
                        text: "Please download all necessary files before uploading.",
                        icon: "error",
                      });
                    }
                  }}
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Upload
                </button>
              ) : null}
              {!edit ? (
                <button
                  className={`${ !areRequiredFilesDownloaded() || requirements.filter((el) => el.file.length > 0).length != getRequiredDocumentsCount(admissions["admissionsArr"][dataIndex]["db_admission_table"][
                    "level_applying_for"], admissions["admissionsArr"][dataIndex]["db_admission_table"][
                      "religion"],admissions["admissionsArr"][dataIndex]["db_admission_table"][
                        "citizenship"])
                      ? "btn-grey"
                      : "btn-blue"
                  } btn btn-add upload-btn`}
                  onClick={
                    
                    areRequiredFilesDownloaded() && requirements.filter((el) => el.file.length > 0).length ==
                      0 ||
                    getLengthRequirements() !=
                      requirements.filter((rqmt) => rqmt.file.length > 0).length
                      ? () =>
                          Swal.fire({
                            title: "No files uploaded",
                            text: "Please check if you have uploaded files",
                            icon: "error",
                          })
                      : () => handleUpload(requirements)
                  }
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Upload
                </button>
              ) : null}
            </div>

            {/* {application > 0 ? (
              <div className="main-section">
                <section className="applications-list-section">
                  <div className="applicant-list">
                    {Array.from({ length: application }).map((_, i) => (
                      <ApplicantCard key={i} />
                    ))}
                  </div>
                </section>
                <section className="status-tracking-section">
                  <div className="tracking-section">
                    <div>
                      <h4 className="admission-step">Registration</h4>
                      <h4 className="admission-step">tRegister in the Admission Portal</span>
                        <span className="desc-subtext">
                          admissions.caritasdonboscoschool@edu.ph
                        </span>
                      </div>
                      <h4
                        className="admission-step desc-step desc-step-succ"
                        onClick={() => setPage("personal-form")}
                      >
                        <span>Fill-out Online Application Form</span>

                        <span className="desc-subtext">
                          View Application Form
                        </span>
                      </h4>
                      <h4
                        className="admission-step desc-step desc-step-succ"
                        onClick={() => setPage("upload")}
                      >
                        Upload Requirements
                      </h4>
                      <h4 className="admission-step desc-step desc-step-succ">
                        Pay AdmisSASion Fee
                      </h4>
                      <h4 className="admission-step desc-step desc-step-succ">
                        Select Schedule and Assessment Exam
                      </h4>
                      <h4 className="admission-step  desc-step desc-step-succ last-step">
                        Wait for Results
                      </h4>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="center-main">
                <div className="no-applications-container">
                  <p>No applications yet?</p>
                  <p className="no-application-sub-text">
                    Please click &quot;Add Applicant&quot; to add an applicant
                  </p>
                </div>

                <div
                  className="btn-blue btn btn-add btn-applicant"
                  onClick={() => {
                    addApplicant();
                  }}
                >
                  Add Applicant
                </div>
              </div>
            )} */}
          </>
        );

      case "calendar":
        return (
          <>
            {admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]?.["db_exam_admission_schedule"].length> 0 ? (
              <Modal show={showReschedModal} id="modal-container" centered>
                {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
                <Modal.Body>
                    <div className="payment-box">
                      {/* <img src={wallet} className="logo-verification" /> */}
                      <h1>Cancel this schedule?</h1>
                      <h3>
                        Date:{" "}
                        <strong>
                          {admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]?.["db_exam_admission_schedule"]?.[0]?.[
                            "db_exam_schedule_table"
                          ]?.["exam_date"] ?? ""}
                        </strong>
                      </h3>
                      <h3>
                        Time:{" "}
                        <strong>
                          {convertMilitaryToAMPM(
                            admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]["db_exam_admission_schedule"][0][
                              "db_exam_schedule_table"
                            ]?.["start_time"] ?? ""
                          )}
                          -
                          {convertMilitaryToAMPM(
                            admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]["db_exam_admission_schedule"][0][
                              "db_exam_schedule_table"
                            ]?.["end_time"] ?? ""
                          )}
                        </strong>
                      </h3>
                      <h3>
                        Location:{" "}
                        <strong>
                          {
                            admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]["db_exam_admission_schedule"][0][
                              "db_exam_schedule_table"
                            ]["location"]
                          }
                        </strong>
                      </h3>

                      <h3>
                        <span
                          style={{
                            marginTop: "2rem",
                            marginBottom: "1rem",
                            display: "flex",
                            color: "grey",
                            fontSize: "1.35rem",
                          }}
                        >
                          Reason for cancellation:
                        </span>

                        <input
                          className="form-control"
                          type="text"
                          value={cancelReasonString}
                          onChange={(e) => {
                            setCancelReasonString(e.target.value);
                          }}
                        ></input>
                      </h3>

                      {/* <hr className="payment-line" /> */}
                      {/* <h2>{formData.email}</h2> */}

                      <hr className="line-container" />
                      <button
                        className="btn btn-blue"
                        onClick={async (e) => {
                          e.preventDefault();
                          if (cancelReasonString.trim() !== "") {
                            await handleSchedCancellation(
                              admissions["admissionsArr"][dataIndex]["db_admission_table"]["db_exam_admission_schedule"][0]["eas_id"],
                              cancelReasonString
                            );
                            setPage("main");
                          }
                        }}
                        disabled={!cancelReasonString.trim()}
                      >
                        Cancel schedule
                      </button>
                      <button
                        className="btn btn-grey"
                        onClick={() => {
                          setShowReschedModal(false);
                        }}
                      >
                        Back
                      </button>
                    </div>
                </Modal.Body>
              </Modal>
            ) : null}

            {admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]?.["db_exam_admission_schedule"].length> 0 ? (
              <Modal
                show={
                  admissions["admissionsArr"][dataIndex][
                    "db_admission_table"
                  ]?.["db_exam_admission_schedule"].length > 0
                }
                id="modal-container"
                centered
              >
                {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */
        
        }
                <Modal.Body>
                  <div className="payment-box">
                    {/* <img src={wallet} className="logo-verification" /> */}
                    <h1>{admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]["db_exam_admission_schedule"][0][
                            "is_attended"] ==null?checkExamStatus(admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]?.["db_exam_admission_schedule"]?.[0]?.[
                              "db_exam_schedule_table"
                            ]?.["exam_date"], convertMilitaryToAMPM(
                              admissions["admissionsArr"][dataIndex][
                                "db_admission_table"
                              ]["db_exam_admission_schedule"][0][
                                "db_exam_schedule_table"
                              ]?.["start_time"] ?? ""
                            ),convertMilitaryToAMPM(
                              admissions["admissionsArr"][dataIndex][
                                "db_admission_table"
                              ]["db_exam_admission_schedule"][0][
                                "db_exam_schedule_table"
                              ]?.["end_time"] ?? ""
                            ))?'Today is scheduled assessment':'Your Scheduled Assessment':admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]["db_exam_admission_schedule"][0][
                              "is_attended"]?'Your scheduled assessment has been completed. Please await the results.':'Your Scheduled Assessment was not attended. Please reschedule if needed.'
                    }
                    </h1>
                    <h3>
                      Date:{" "}
                      <strong>
                        {admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]?.["db_exam_admission_schedule"]?.[0]?.[
                          "db_exam_schedule_table"
                        ]?.["exam_date"] ?? ""}
                      </strong>
                    </h3>
                    <h3>
                      Time:{" "}
                      <strong>
                        {convertMilitaryToAMPM(
                          admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]["db_exam_admission_schedule"][0][
                            "db_exam_schedule_table"
                          ]?.["start_time"] ?? ""
                        )}
                        -
                        {convertMilitaryToAMPM(
                          admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]["db_exam_admission_schedule"][0][
                            "db_exam_schedule_table"
                          ]?.["end_time"] ?? ""
                        )}
                      </strong>
                    </h3>
                    <h3>
                      Location:{" "}
                      <strong>
                        {
                          admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]["db_exam_admission_schedule"][0][
                            "db_exam_schedule_table"
                          ]["location"]
                        }
                      </strong>
                    </h3>

                    {/* <hr className="payment-line" /> */}
                    {/* <h2>{formData.email}</h2> */}

                    <br></br>
                    <h3>
                        <a href={getLevelAssessmentReminder(`${admissions["admissionsArr"][dataIndex]["db_admission_table"]['level_applying_for']}`)} download={`${admissions["admissionsArr"][dataIndex]["db_admission_table"]['level_applying_for']}-assessment`} style={{ color: "#012169", textDecoration: "underline" }}>
                        View {admissions["admissionsArr"][dataIndex]["db_admission_table"]['level_applying_for']} Assessment Reminder
                        </a>
                    </h3>
                    <hr className="line-container" />
                    <button
                      className="btn btn-blue"
                      onClick={async(e) => {
                          if(!admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]["db_exam_admission_schedule"][0][
                            "is_attended"] && admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]["db_exam_admission_schedule"][0][
                              "is_attended"] !=null){ 
                            await handleSchedCancellation(admissions["admissionsArr"][dataIndex]["db_admission_table"]["db_exam_admission_schedule"][0]["eas_id"],
                              'to be reschedule, due to failed to attend the assessment schedule'
                            );
                          }
                        setPage("main");
                        setShowReschedModal(false);
                      }}
                    >
                      Ok, got it!
                    </button>
                    {/*<button
                      className="btn btn-red"
                      onClick={() => {
                        console.log("wahaha");
                        setCancelReasonString("");

                        setShowReschedModal((prev) => !prev);
                      }}
                    >
                      Reschedule
                    </button>*/
                    
                    (() => {
                      const examDate = admissions["admissionsArr"][dataIndex]["db_admission_table"]["db_exam_admission_schedule"][0]["db_exam_schedule_table"]["exam_date"];
                      const today = new Date();
                      const examDateObj = new Date(examDate);
                      
                      // Calculate the difference in days
                      const daysDifference = getDateDifferenceInDays(today, examDateObj);
                      console.log(daysDifference);
                      // Enable "Reschedule" button only if the difference is 2 days or less
                      return (
                        <button
                          className="btn btn-red"
                          onClick={() => {
                            console.log("wahaha");
                            setCancelReasonString("");
                            setShowReschedModal((prev) => !prev);
                          }}
                          disabled={daysDifference >= 2 || (admissions["admissionsArr"][dataIndex][
                            "db_admission_table"
                          ]["db_exam_admission_schedule"][0][
                            "is_attended"] && admissions["admissionsArr"][dataIndex][
                              "db_admission_table"
                            ]["db_exam_admission_schedule"][0][
                              "is_attended"] !=null)} // Disable if more than 2 days difference
                        >
                          Reschedule
                        </button>
                      );
                    })()
              
                    
                    }
                  </div>
                </Modal.Body>
              </Modal>
            ) : schedules.length == 0 ? <Modal
            show={schedules.length==0
            }
            id="modal-container"
            centered
          >
            {
            console.log('Hi'+scheduleForDay.length)
            /* <Modal.Header closeButton>
      <Modal.Title>Applicant Information</Modal.Title>
    </Modal.Header> */}
            <Modal.Body>
              <div className="payment-box">
              <div 
                className="close-icon" 
                onClick={() => {
                    setPage("main");
                    setShowReschedModal(false);
                }}
              >
                ✕
              </div>
                {/* <img src={wallet} className="logo-verification" /> Walang Sched*/}
                
                <br></br>
                <br></br>
                <img src={circle_cross} className="logo-verification" />
                <br></br>
                <br></br>
                <h3>
                  No Available Schedule Yet
                </h3>
                <h5>
                  Please wait for further announcements and updates for the next available schedule. Thank you.
                  
                
                </h5>
                <span className="time-header" style={{width:'40rem'}}></span>
                <hr className="line-container" />
                {/* <hr className="payment-line" /> */}
                {/* <h2>{formData.email}</h2> */}
                <button
                  className="btn btn-blue"
                  onClick={() => {
                    setPage("main");
                    setShowReschedModal(false);
                  }}
                  style={{width:'40rem'}}
                >
                  Back to Admission Process
                </button>
              </div>
            </Modal.Body>
          </Modal>:null}
            <Modal show={showCalendarModal} id="modal-container" centered>
              {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
              <Modal.Body>
                <div className="payment-box">
                  {/* <img src={wallet} className="logo-verification" /> */}
                  <h1>Are you sure you want to select this exam schedule?</h1>
                  <h3>
                    Date: <strong>{scheduleDetails.date}</strong>
                  </h3>
                  <h3>
                    Time:{" "}
                    <strong>
                      {scheduleDetails.timeStart}-{scheduleDetails.timeEnd}
                    </strong>
                  </h3>
                  <h3>
                    Location: <strong>{scheduleDetails.location}</strong>
                  </h3>

                  {/* <hr className="payment-line" /> */}
                  {/* <h2>{formData.email}</h2> */}

                  <hr className="line-container" />
                  <button
                    className="btn btn-blue"
                    onClick={() => {
                      handleShowCalendarModal();
                      reserveDate(
                        scheduleDetails.scheduleId,
                        admissions["admissionsArr"][dataIndex][
                          "db_admission_table"
                        ]["level_applying_for"]
                      );
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-grey"
                    onClick={handleShowCalendarModal}
                  >
                    No
                  </button>
                </div>
              </Modal.Body>
            </Modal>
            <div className="main-dashboard-container">
              <div className="main-header">
                <div className="main-text-head">
                  <img src={back} onClick={() => setPage("main")} />
                  <h1>Assessment Exam Schedules</h1>
                </div>
                {/*<button
                  className="btn-blue btn btn-add"
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Confirm
                </button>*/}
              </div>
            </div>
            <div className="select-sched-container">
              <div className="calendar-container">
                <BigCalendar
                  availableDates={datesAvailable}
                  selectedDate={selectedDate}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  setSelectedDate={setSelectedDate}
                  schedules={schedules}
                  handleScheduleForDay={handleScheduleForDay}
                />
                <div className="legend">
                  <div> LEGEND:</div>
                  <div>
                    <span className="legend-current"></span> Currently Selected
                  </div>
                  <div>
                    <span className="legend-available"></span> with Available
                    Slots
                  </div>
                </div>
              </div>

              <div className="schedules-container">
                <span className="time-header">Time</span>
                <div className="schedule-lists">
                  {selectedDate === null ? (
                    <h2 className="time-no-date-header">
                      Please select a date
                    </h2>
                  ) : scheduleForDay.length == 0 ? (
                    <h2 className="time-no-date-header">
                      No available schedules for this date
                    </h2>
                  ) : (
                    <>
                      {scheduleForDay.map((el, i) => (
                        <ScheduleItem
                          handleShowCalendarModal={handleShowCalendarModal}
                          scheduleId={el["schedule_id"]}
                          key={el["schedule_id"]}
                          timeStart={el["start_time"]}
                          timeEnd={el["end_time"]}
                          location={el["location"]}
                          handleScheduleDetails={handleScheduleDetails}
                          date={el["exam_date"]}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case "payment":
        return (
          <Payment
            dataIndex={dataIndex}
            paymethodId={
              admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "paymethod_id"
              ]
            }
            applicationId={
              admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "admission_form_id"
              ]
            }
            setPage={setPage}
          />
        );

      case "profile":
        return (
          <>
            <div className="main-dashboard-container">
              <div className="main-header">
                <div className="main-text-head">
                  <img src={back} onClick={() => setPage("main")} />
                  <h1>Account Information</h1>
                </div>
                {/*<button
                  className="btn-blue btn btn-add"
                  // onClick={addApplicant}
                  // onClick={() => setPage("personal-form")}
                >
                  Confirm
                </button>*/}
              </div>
            </div>
            <div>
              <div className="name-container">
                <p className="profile-label">Name</p>
                <p className="profile-data">{user["firstName"]}</p>
              </div>
              <div className="name-container">
                <p className="profile-label">Email</p>
                <p className="profile-data">{user["emailAddress"]}</p>
              </div>

              <div className="contact-numbers-row">
                <div className="contact-container">
                  <p className="profile-label">Mobile number</p>
                  <p className="profile-data">{user["contactNo"]}</p>
                </div>
                <div className="contact-container">
                  <p className="profile-label">Landline number</p>
                  <p className="profile-data">{user["contactNo"]}</p>
                </div>
              </div>
            </div>
          </>
        );


      case "pre-enrollment":
        return (
          <PreEnrollmentPayment
            dataIndex={dataIndex}
            paymethodId={
              admissions?.["admissionsArr"]?.[dataIndex]?.["db_admission_table"]?.["db_payments_table"]?.[0]?.['pay_method_id'] || 0
            }
            applicationId={
              admissions["admissionsArr"][dataIndex]["db_admission_table"][
                "admission_form_id"
              ]
            }
            setPage={setPage}
          />
        );
      default:
        return <div>hello</div>;
      // }
    }
  };

  return (
    <main className="main-container">
      <Modal show={show} onHide={handleClose} id="modal-container" centered>
        {/* <Modal.Header closeButton>
          <Modal.Title>Applicant Information</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="logo-modal-container">
            <img src={logo} className="logo-modal" />
            <h2 className="text-modal-heading">Applicant Registration</h2>
            <h3 className="text-modal-subheading">
              Please register the applicant's name and intended grade level
            </h3>
            {isSlotsLoading ? (
              <ReactLoading
                className="app-loader"
                type={"bubbles"}
                color="#012169"
              />
            ) : null}
          </div>
          <div className="modal-form-container">
            <Form.Group controlId="gradeLevel" className="mt-3">
              <Form.Label>Level Applying For</Form.Label>
              <Form.Select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                required
                disabled={isSlotsLoading}
              >
                <option value="" disabled>
                  Select grade level
                </option>
                <option
                  value="Pre-Kinder"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter(
                      (el) => el["level"] == "Pre-Kinder"
                    )[0]["available"]
                  }
                >
                  Pre-kindergarten{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Pre-Kinder")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Kinder"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Kinder")[0][
                      "available"
                    ]
                  }
                >
                  Kindergarten{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Kinder")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 1"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 1")[0][
                      "available"
                    ]
                  }
                >
                  Grade 1{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 1")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 2"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 2")[0][
                      "available"
                    ]
                  }
                >
                  Grade 2{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 2")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 3"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 3")[0][
                      "available"
                    ]
                  }
                >
                  Grade 3{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 3")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 4"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 4")[0][
                      "available"
                    ]
                  }
                >
                  Grade 4{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 4")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 5"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 5")[0][
                      "available"
                    ]
                  }
                >
                  Grade 5{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 5")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 6"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 6")[0][
                      "available"
                    ]
                  }
                >
                  Grade 6{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 6")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 7"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 7")[0][
                      "available"
                    ]
                  }
                >
                  Grade 7{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 7")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 8"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 8")[0][
                      "available"
                    ]
                  }
                >
                  Grade 8{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 8")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 9"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 9")[0][
                      "available"
                    ]
                  }
                >
                  Grade 9{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 9")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 10"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 10")[0][
                      "available"
                    ]
                  }
                >
                  Grade 10{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 10")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 11"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 11")[0][
                      "available"
                    ]
                  }
                >
                  Grade 11{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 11")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
                <option
                  value="Grade 12"
                  disabled={
                    isLoading ||
                    !scheduleSlots.filter((el) => el["level"] == "Grade 12")[0][
                      "available"
                    ]
                  }
                >
                  Grade 12{" "}
                  {isLoading ||
                  !scheduleSlots.filter((el) => el["level"] == "Grade 12")[0][
                    "available"
                  ]
                    ? "- slots unavailable"
                    : ""}
                </option>
              </Form.Select>
            </Form.Group>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                setShow(false);
                handleSubmit();
                // addApplicant();
                clearModalRegister();
              }}
            >
              <Form.Group controlId="surname">
                <Form.Label id="applicant-name-label">
                  Applicant Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="firstName" className="mt-1">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="middleName" className="mt-1">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter middle name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </Form.Group>

              <hr className="line-container" />
              <div className="button-group-container">
                <Button variant="primary" type="submit" className="mt-4 w-50">
                  Register
                </Button>
                <Button
                  variant="secondary"
                  className=" w-50"
                  onClick={() => {
                    if (user["registryType"] != "learner") {
                      clearModalRegister();
                    }
                    setShow(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
      {isLoading ? (
        <ReactLoading
          className="app-loader app-loader-main-view"
          type={"bubbles"}
          color="#012169"
        />
      ) : (
        renderContent()
      )}
    </main>
  );
}

export default MainView;
