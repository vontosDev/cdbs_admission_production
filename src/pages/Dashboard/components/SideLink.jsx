import { useNavigate } from "react-router-dom";

function SideLink({ icon, labelText }) {
  const navigate = useNavigate();
  return (
    <div
      className="side-link-container welcome-container"
      // onClick={labelText === "My Account" ? () => navigate("/profile") : null}
    >
      <img src={icon} className="side-link-icon" />
      <div className="side-links-text">
        <h2>{labelText}</h2>
      </div>
    </div>
  );
}

export default SideLink;
