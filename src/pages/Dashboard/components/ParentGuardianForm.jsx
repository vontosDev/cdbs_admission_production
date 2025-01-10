import { useEffect, useState } from "react";

function ParentGuardianForm({
  nameLabel,
  parentGuardianObj,
  checked,
  setChecked,
  handleChange,
}) {
  // const parentGuardianMap = {
  //   nameLabel: nameLabel,
  // };
  const [ageField, setAgeField] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const handleDobChange = (e) => {
    // setIsLoading(true);
    if (parentGuardianObj["dateOfBirth"] == null) return;
    // console.log(e?.target.value);
    // console.log(parentGuardianObj["dateOfBirth"]);
    const selectedDate =
      new Date(parentGuardianObj["dateOfBirth"]) ?? new Date(e.target.value);
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

    // console.log(`AGE: ${calculatedAge}`);
    setAgeField(() => (calculatedAge >= 0 ? calculatedAge : ""));

    if (calculatedAge < 0) {
      handleDobChange();
    }
    // setDob(e.target.value);
    // setIsLoading(false);
  };

  useEffect(() => {
    handleDobChange();
    // console.log(parentGuardianObj);
  }, [parentGuardianObj.dateOfBirth]);

  return (
    <div
      className={
        nameLabel == "Guardian's"
          ? checked
            ? "parentguardian-form-container-2"
            : "parentguardian-form-container"
          : "parentguardian-form-container"
      }
    >
      <span className="subhead-checkbox">
        <input
          onChange={() => {
            setChecked((prev) => !prev);
          }}
          name="parent-checkbox"
          id={`${nameLabel}-checkbox`}
          type="checkbox"
          checked={checked}
        />
        <label
          htmlFor={`${nameLabel}-checkbox`}
          className="form-sub-header checkbox-text"
        >
          {nameLabel == "Father's"
            ? "Father"
            : nameLabel == "Mother's Maiden"
            ? "Mother"
            : "Guardian "}{" "}
          - Please{" "}
          <span className="highlight-sub-header">
            check the box if applicable
          </span>
        </label>
      </span>
      {checked ? (
        <>
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="name" className="label-form">
                {nameLabel} Name*
              </label>
              <input
                value={parentGuardianObj["lastName"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="lastName"
                type="text"
                className="form-textfield third-occ form-control"
                placeholder="Family Name"
                readOnly={!checked}
                required={checked}
              />
            </div>
            <div className="form-col">
              <p className="label-form colorless">Full Name*</p>
              <input
                value={parentGuardianObj["firstName"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
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
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="middleName"
                type="text"
                className="form-textfield third-occ form-control"
                placeholder="Middle Name"
                readOnly={!checked}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="name" className="label-form">
                Date of Birth*
              </label>
              <input
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                  handleDobChange(e);
                }}
                id="dateOfBirth"
                type="date"
                max={today}
                value={parentGuardianObj["dateOfBirth"]}
                className="form-textfield third-occ form-control"
                placeholder="Family Name"
                readOnly={!checked}
                required={checked}
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
            <div className="form-col fifth-occ">
              <p className="label-form">Age*</p>
              <input
                value={ageField}
                type="text"
                className="form-textfield fifth-occ form-control"
                placeholder="Age"
                readOnly={!checked}
                required={checked}
              />
            </div>
            <div className="form-col">
              <p className="label-form ">Educational Attainment*</p>
              {/* <input
                value={parentGuardianObj["educationAttainment"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="educationAttainment"
                type="text"
                className="form-textfield third-occ form-control"
                placeholder="Educational Attainment"
                readOnly={!checked}
                required={checked}
              /> */}
              <select
                id="educationAttainment"
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                value={parentGuardianObj["educationAttainment"]}
                className="form-select"
                required
              >
                <option value="" disabled>
                  Please select
                </option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="College Graduate">College Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
            </div>
            <div className="form-col">
              <p className="label-form ">Employment Status*</p>
              <select
                id="employmentStatus"
                className="form-select"
                value={parentGuardianObj["employmentStatus"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                required={checked}
              >
                <option value="" disabled>
                  Please select employment status
                </option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
              {/* <input
            value={parentGuardianObj["employmentStatus"]}
            onChange={(e) => {
              handleChange(
                e,
                "family2",
                nameLabel == "Father's"
                  ? "father"
                  : nameLabel == "Mother's Maiden"
                  ? "mother"
                  : "guardian"
              );
            }}
            id="employmentStatus"
            type="text"
            className="form-textfield third-occ form-control"
            placeholder="Employment Status"
            readOnly={!checked}
            required={checked}
          /> */}
            </div>
          </div>
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="name" className="label-form">
                Employed at*
              </label>
              <input
                value={parentGuardianObj["employedAt"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="employedAt"
                type="text"
                className="form-textfield third-occ form-control"
                placeholder="Employed at"
                readOnly={!checked}
                required={
                  checked && parentGuardianObj["employmentStatus"] == "Employed"
                }
              />
            </div>

            <div className="form-col">
              <p className="label-form ">Office Address*</p>
              <input
                type="text"
                value={parentGuardianObj["officeAddress"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="officeAddress"
                className="form-textfield third-occ form-control"
                placeholder="Office Address"
                readOnly={!checked}
                required={
                  checked && parentGuardianObj["employmentStatus"] == "Employed"
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="name" className="label-form">
                Contact No*
              </label>
              <input
                maxLength={11}
                onInput={(e) => {
                  const input = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
                  e.target.value = input;
                  if (input.length <= 11 || input.length >= 8) {
                    handleChange(
                      e,
                      "family2",
                      nameLabel == "Father's"
                        ? "father"
                        : nameLabel == "Mother's Maiden"
                        ? "mother"
                        : "guardian"
                    );
                  }
                }}
                onBlur={(e) => {
                  const input = e.target.value.replace(/[^0-9]/g, "");
                  if (input.length !== 11 && input.length !== 8) {
                    alert("Contact number must be either 8 or 11 digits.");
                    e.target.value = "";
                    handleChange(
                      e,
                      "family2",
                      nameLabel == "Father's"
                        ? "father"
                        : nameLabel == "Mother's Maiden"
                        ? "mother"
                        : "guardian"
                    ); // Clear value in the state
                  }
                }}
                value={parentGuardianObj["contactNo"]}
                id="contactNo"
                type="text"
                className="form-textfield third-occ form-control"
                placeholder="Contact number"
                readOnly={!checked}
                required={checked}
              />
            </div>
            <div className="form-col">
              <p className="label-form">Position*</p>
              <input
                value={parentGuardianObj["position"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="position"
                type="text"
                className="form-textfield third-occ form-control"
                placeholder="Position title"
                readOnly={!checked}
                required={
                  checked && parentGuardianObj["employmentStatus"] == "Employed"
                }
              />
            </div>
            <div className="form-col">
              <p className="label-form">Salary Scale*</p>
              <select
                value={parentGuardianObj["salary"]}
                onChange={(e) => {
                  handleChange(
                    e,
                    "family2",
                    nameLabel == "Father's"
                      ? "father"
                      : nameLabel == "Mother's Maiden"
                      ? "mother"
                      : "guardian"
                  );
                }}
                id="salary"
                type="text"
                className=" third-occ form-select"
                readOnly={!checked}
                required={
                  checked && parentGuardianObj["employmentStatus"] == "Employed"
                }
              >
                <option value="" disabled>
                  Please select salary scale
                </option>
                <option value="PhP 9,999">&lt; PhP 9,999</option>
                <option value="PhP 10,000 - 19,999">PhP 10,000 - 19,999</option>
                <option value="PhP 20,000 - 39,999">PhP 20,000 - 39,999</option>
                <option value="PhP 40,000 - 69,999">PhP 40,000 - 69,999</option>
                <option value="PhP 70,000 - 99,999">PhP 70,000 - 99,999</option>
                <option value="PhP 100,000+">PhP 100,000+</option>
              </select>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ParentGuardianForm;
