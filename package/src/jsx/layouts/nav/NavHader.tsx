/// React router dom
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import nddclogo from "../../../assets/images/NDDC LOGO - PNG 1.png";

const NavHader = () => {
  const { openMenuToggle, setOpenMenuToggle } = useContext(ThemeContext);
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo d-flex align-items-center justify-content-center text-decoration-none">
        <img src={nddclogo} alt="NDDC Logo" className="w-100 p-2" style={{ maxWidth: '220px', maxHeight: '75px', objectFit: 'contain' }} />
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setOpenMenuToggle(!openMenuToggle);
        }}
      >

        <div className={`hamburger ${openMenuToggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="22" width="4" height="4" rx="2" fill="#2A353A" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
