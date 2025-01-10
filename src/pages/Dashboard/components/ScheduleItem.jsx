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

export default ScheduleItem;
