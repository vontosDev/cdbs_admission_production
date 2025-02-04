/*function ScheduleItem({
  scheduleId,
  timeStart,
  timeEnd,
  location,
  handleShowCalendarModal,
  handleScheduleDetails,
  date,
}) {
  const formDate = new Date(date);
  function convertMilitaryToAMPM(militaryTime) {
    const [hours, minutes] = militaryTime.split(":").map(Number);

    // Create a Date object with the given time (assuming today's date)
    const date = new Date();
    date.setHours(hours, minutes);

    // Use toLocaleString to format the time in 12-hour AM/PM format
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  }

  return (
    <div
      className="schedule-item-container"
      onClick={() => {
        handleScheduleDetails(
          scheduleId,
          convertMilitaryToAMPM(timeStart),
          convertMilitaryToAMPM(timeEnd),
          location,
          formDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
        handleShowCalendarModal();
      }}
    >
      <span>
        {`${convertMilitaryToAMPM(timeStart)}`} -{" "}
        {`${convertMilitaryToAMPM(timeEnd)}`}
      </span>
    </div>
  );
}

export default ScheduleItem;*/


import React from "react";

function ScheduleItem({
  scheduleId,
  timeStart,
  timeEnd,
  location,
  handleShowCalendarModal,
  handleScheduleDetails,
  date,
}) {
  const formDate = new Date(date);

  // Convert military time (e.g. 13:00) to 12-hour AM/PM format
  function convertMilitaryToAMPM(militaryTime) {
    const [hours, minutes] = militaryTime.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes);

    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  }

  // Check if the schedule time has already passed
  function isSchedulePassed(timeEnd) {
    const [hours, minutes] = timeEnd.split(":").map(Number);
    const currentDateTime = new Date();
    currentDateTime.setHours(hours, minutes, 0, 0);

    // Return true if the time has passed, false otherwise
    return currentDateTime < new Date();
  }

  // Check if the schedule is in the past
  const isPassed = isSchedulePassed(timeEnd);

  return (
    <div
      className={`schedule-item-container ${isPassed ? "gray-out" : ""}`}
      onClick={() => {
        if (!isPassed) {
          handleScheduleDetails(
            scheduleId,
            convertMilitaryToAMPM(timeStart),
            convertMilitaryToAMPM(timeEnd),
            location,
            formDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
          handleShowCalendarModal();
        }
      }}
      style={{
        cursor: isPassed ? "not-allowed" : "pointer",
        backgroundColor: isPassed ? "#d3d3d3" : "transparent", // Gray out passed schedules
      }}
    >
      <span>
        {`${convertMilitaryToAMPM(timeStart)} - ${convertMilitaryToAMPM(timeEnd)}`}
      </span>
    </div>
  );
}

export default ScheduleItem;
