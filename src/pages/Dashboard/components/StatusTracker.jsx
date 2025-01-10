import check from "../../../assets/images/check.png";
import close from "../../../assets/images/close-2.svg";

function StatusTracker({
  isApplicationComplete,
  isUploadPending,
  isUploadRejected,
  isAssessmentPending,
  isUploadComplete,
  isPaymentComplete,
  isPaymentPending,
  isAssessmentSelected,
  isResultSent,
  isApplicationInReview,
  isApplicationCreated,
  isApplicationPending,
  isUploadCreated,
  isPaid,
}) {
  return (
    <div className="steps-container ">
      <div className="circle">
        <img src={check} />
      </div>
      <div className="dash-line"></div>
      {isApplicationComplete ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : isApplicationPending ? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ) : (
        <div className="circle-outline">2</div>
      )}
      <div className="dash-line"></div>
      {isUploadComplete ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : isUploadRejected ? (
        <div title="Please reupload" className="circle circle-reject">
          <img src={close} />
        </div>
      ) : isUploadPending ? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ) : (
        <div className="circle-outline">3</div>
      )}
      <div className="dash-line"></div>
      {isPaymentComplete ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : isPaymentPending ? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ) : (
        <div className="circle-outline">4</div>
      )}
      <div className="dash-line"></div>
      {isAssessmentSelected ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : (
        <div className="circle-outline">5</div>
      )}
      <div className="dash-line"></div>
      {isResultSent ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : isAssessmentPending ? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ) : (
        <div className="circle-outline">6</div>
      )}
    </div>
  );
}

export default StatusTracker;
