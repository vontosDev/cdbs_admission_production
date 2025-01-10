import { useEffect, useState } from "react";

function SiblingForm({
  lastName,
  firstName,
  middleName,
  dateOfBirth,
  age,
  occupation,
  office,
  handleChange,
}) {
  const [ageField, setAgeField] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleDobChange = (e) => {
    // setIsLoading(true);
    if (dateOfBirth == null) return;
    console.log(e?.target.value);
    console.log(dateOfBirth);
    const selectedDate = new Date(dateOfBirth) ?? new Date(e.target.value);
    const today = new Date();

    // console.log(`DAA: ${selectedDate}`);

    if (selectedDate > today) {
      setAgeField("");
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
    setAgeField(() => (calculatedAge >= 0 ? calculatedAge : ""));

    if (calculatedAge < 0) {
      handleDobChange();
    }
    // setDob(e.target.value);
    // setIsLoading(false);
  };
  useEffect(() => {
    handleDobChange();
  }, []);

  return (
    <div className="sibling-form-container">
      <div className="form-row">
        <div className="form-col">
          <label htmlFor="name" className="label-form">
            Name*
          </label>
          {/* const newSiblingData = {
                          siblingFamilyName: "",
                          siblingFirstName: "",
                          siblingMiddleName: "",
                          siblingDob: "",
                          siblingAge: "",
                          siblingOccupation: "",
                          siblingBusinessOffice: "",
                        }; */}
          <input
            value={lastName}
            id="siblingFamilyName"
            onChange={(e) => handleChange(e)}
            type="text"
            className="form-textfield third-occ form-control"
            placeholder="Family Name"
            required
          />
        </div>
        <div className="form-col">
          <p className="label-form colorless">Full Name*</p>
          <input
            value={firstName}
            id="siblingFirstName"
            onChange={(e) => handleChange(e)}
            type="text"
            className="form-textfield third-occ form-control"
            placeholder="First Name"
            required
          />
        </div>
        <div className="form-col">
          <p className="label-form colorless">. </p>
          <input
            value={middleName}
            type="text"
            id="siblingMiddleName"
            onChange={(e) => handleChange(e)}
            className="form-textfield third-occ form-control"
            placeholder="Middle Name"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-col">
          <label htmlFor="name" className="label-form">
            Date of Birth*
          </label>
          <input
            max={today}
            value={dateOfBirth}
            id="siblingDob"
            onChange={(e) => {
              handleChange(e);
              handleDobChange(e);
            }}
            type="date"
            className="form-textfield third-occ form-control"
            placeholder="Date of Birth"
            required
          />
        </div>
        {/* <div className="form-col fifth-occ">
          <p className="label-form">Age*</p>
          <input
            id="siblingAge"
            value={ageField}
            type="text"
            className="form-textfield fifth-occ form-control"
            placeholder="Age"
            readOnly
          />
        </div> */}
        <div className="form-col">
          <p className="label-form">Grade level/Course/Occupation* </p>
          <input
            id="siblingOccupation"
            type="text"
            onChange={(e) => handleChange(e)}
            value={occupation}
            className="form-textfield third-occ form-control"
            placeholder="Grade level/Course/Occupation"
            required
          />
        </div>
        <div className="form-col">
          <p className="label-form ">School/Business Office* </p>
          <input
            id="siblingBusinessOffice"
            onChange={(e) => handleChange(e)}
            value={office}
            type="text"
            className="form-textfield third-occ form-control"
            placeholder="School/Business Office"
            required
          />
        </div>
      </div>
    </div>
  );
}

export default SiblingForm;
