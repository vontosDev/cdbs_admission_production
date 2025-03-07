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
  isPendingAssessment,
  isResultSent,
  isApplicationInReview,
  isApplicationCreated,
  isApplicationPending,
  isUploadCreated,
  isPaid,
  isPassed,
  isAssessmentAttended,
  toPreEnrollment,
  preEnrollmentStatus,
  toPreRequirement
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
      ): !isApplicationPending ? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ): isApplicationPending && !isApplicationComplete ? (
        <div title="Pending" className="circle circle-waiting">
          <img src={check} />
        </div>
      )  : (
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
      ) : !isUploadComplete && isApplicationPending && !isUploadPending? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
          {console.log('hi'+isUploadPending)} 
        </div>
      ):isApplicationComplete ||( isApplicationPending && !isUploadComplete && isUploadPending)?(
        <div title="Pending" className="circle circle-waiting">
          <img src={check} />
        </div>
      ): (
        <div className="circle-outline">3</div>
      )}
      <div className="dash-line"></div>
      {isPaymentComplete ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : !isPaymentPending && isUploadComplete && isApplicationComplete? (
        <div title="Pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ) : isPaymentPending && !isPaymentComplete ? (
        <div title="Pending" className="circle circle-waiting">
          <img src={check} />
        </div>
      ) : (
        <div className="circle-outline">4</div>
      )}
      <div className="dash-line"></div>
      {!isAssessmentAttended && isAssessmentSelected && isAssessmentAttended != null ? 
        (
          <div title="Complete" className="circle-reject">
            <img src={close} />
          </div>
        )
      :isPendingAssessment || isResultSent? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ):!isAssessmentSelected && isPaymentComplete ? (
        <div title="pending" className="circle circle-pending">
          <img src={check} />
        </div>
      ) : isAssessmentSelected && !isPendingAssessment ? (
        <div title="pending" className="circle circle-waiting">
          <img src={check} />
        </div>
      ): (
        <div className="circle-outline">5</div>
      )}
      <div className="dash-line"></div>
      {isResultSent && isPassed ? (
        <div title="Complete" className="circle">
          <img src={check} />
        </div>
      ) : isPendingAssessment ? (
        <div title="Pending" className="circle circle-waiting">
          <img src={check} />
        </div>
      ) : isResultSent && !isPassed? (
        <div title="Pending" className="circle circle-reject">
          <img src={close} />
        </div>
      ) : (
        <div className="circle-outline">6</div>
      )}

      {toPreEnrollment && (
        <>
          <div className="dash-line"></div>
          {preEnrollmentStatus =='paid' ? (
            <div title="Complete" className="circle">
              <img src={check} />
            </div>
          ) : preEnrollmentStatus == '' ? (
            <div title="Pending" className="circle circle-pending">
              <img src={check} />
            </div>
          ): preEnrollmentStatus == 'pending' ? (
            <div title="Pending" className="circle circle-waiting">
              <img src={check} />
            </div>
          ) : (
            <div className="circle-outline">7</div>
          )}

        <div className="dash-line"></div>
          {toPreRequirement? (
            <div title="Complete" className="circle">
              <img src={check} />
            </div>
          ) : !toPreRequirement && preEnrollmentStatus=='paid'? (
            <div title="Pending" className="circle circle-pending">
              <img src={check} />
            </div>
          ) : (
            <div className="circle-outline">8</div>
          )}
        </>
      )}
    </div>
  );
}

export default StatusTracker;
