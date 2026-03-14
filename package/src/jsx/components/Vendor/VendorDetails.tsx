import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SVGICON } from "../Dashboard/Content";
import { toast } from "react-toastify";
//import PaymentHistoryTable from "./PaymentHistoryTable";
import { apiFetch } from "../../../utils/api";

interface VendorDetailsData {
  id: string;
  companyName: string;
  rcNumber: string;
  tinNumber: string;
  email: string;
  phoneNumber: string;
  companyAddress: string;
  websiteAddress: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  status: string;
}

interface scheduleBlogType {
  title: string;
  subtitle: string;
  color: string;
}
interface basicDetailType {
  title: string;
  subtitle: string;
  icon: string;
}
const scheduleBlog: scheduleBlogType[] = [
  { title: "Basic Algorithm", subtitle: "Algorithm", color: "schedule-card" },
  { title: "Basic Art", subtitle: "Art", color: "schedule-card-1" },
  { title: "React & Scss", subtitle: "Programming", color: "schedule-card-2" },
  { title: "Simple Past Tense", subtitle: "English", color: "schedule-card-3" },
];

const VendorDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const vendorId = location.state?.vendorId;

  useEffect(() => {
    if (!vendorId) {
      toast.warning("No vendor selected. Redirecting to vendors list.");
      navigate("/vendors");
      return;
    }

    const fetchVendorDetails = async () => {
      try {
        const response = await apiFetch(`/api/v1/vendors/${vendorId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vendor details");
        }

        const data = await response.json();
        const v = data.data || data;

        // Try to fetch contact details separately if needed or just use what's there
        let vc = v.vendorContact || {};

        try {
          const contactResponse = await apiFetch(`/api/v1/vendor/contacts/${vendorId}`, {
            method: "GET",
          });
          if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            vc = contactData.data || contactData;
          }
        } catch (contactError) {
          console.error("Error fetching vendor contact separately:", contactError);
          // Fallback to what's in the vendor object
        }

        setVendor({
          id: v.id || v._id || "",
          companyName: v.companyName || "N/A",
          rcNumber: v.rcNumber || "N/A",
          tinNumber: v.tinNumber || "N/A",
          email: v.email || "N/A",
          phoneNumber: v.phoneNumber || "N/A",
          companyAddress: v.companyAddress || "N/A",
          websiteAddress: v.websiteAddress || "N/A",
          contactFirstName: vc.firstName || v.contactFirstName || "N/A",
          contactLastName: vc.lastName || v.contactLastName || "N/A",
          contactEmail: vc.email || v.contactEmail || "N/A",
          contactPhone: vc.phoneNumber || v.contactPhone || v.contactPhoneNumber || "N/A",
          contactAddress: vc.address || v.contactAddress || "N/A",
          status: v.status || "UNKNOWN",
        });
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        toast.error("Could not load vendor profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId, navigate]);

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  const basicDetail: basicDetailType[] = [
    { title: "RC Number", subtitle: vendor.rcNumber, icon: "fa-solid fa-file-contract" },
    { title: "TIN", subtitle: vendor.tinNumber, icon: "fa-solid fa-file-invoice-dollar" },
    { title: "Email", subtitle: vendor.email, icon: "fa-solid fa-envelope" },
    { title: "Phone", subtitle: vendor.phoneNumber, icon: "fa-solid fa-phone" },
    { title: "Address", subtitle: vendor.companyAddress, icon: "fa-solid fa-location-dot" },
    { title: "Website", subtitle: vendor.websiteAddress, icon: "fa-solid fa-globe" },
    { title: "Contact First Name", subtitle: vendor.contactFirstName, icon: "fa-solid fa-user-tie" },
    { title: "Contact Last Name", subtitle: vendor.contactLastName, icon: "fa-solid fa-user-tie" },
    { title: "Contact Phone", subtitle: vendor.contactPhone, icon: "fa-solid fa-phone" },
    { title: "Contact Email", subtitle: vendor.contactEmail, icon: "fa-solid fa-envelope-open-text" },
    { title: "Contact Address", subtitle: vendor.contactAddress, icon: "fa-solid fa-map-location-dot" },
  ];

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="row">
      <div className="col-xl-9">
        <div className="card h-auto">
          <div className="card-header p-0">
            <div className="user-bg w-100">
              <div className="user-svg">
                <svg
                  width="264"
                  height="109"
                  viewBox="0 0 264 109"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.0107422"
                    y="0.6521"
                    width="263.592"
                    height="275.13"
                    rx="20"
                    fill="#FCC43E"
                  />
                </svg>
              </div>
              <div className="user-svg-1">
                <svg
                  width="264"
                  height="59"
                  viewBox="0 0 264 59"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.564056"
                    width="263.592"
                    height="275.13"
                    rx="20"
                    fill="#FB7D5B"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <div className="user">
                <div className="user-media">
                  <div className="avatar avatar-xxl bg-primary d-flex align-items-center justify-content-center text-white" style={{ fontSize: "2rem", fontWeight: 700 }}>
                    {getInitials(vendor.companyName)}
                  </div>
                </div>
                <div>
                  <h2 className="mb-0">{vendor.companyName}</h2>
                  <p className="text-primary font-w600">Vendor | Status: {vendor.status}</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2">
                <Link
                  to="/edit-vendor"
                  state={{ vendorId: vendor.id }}
                  className="btn btn-primary btn-sm me-3"
                >
                  <i className="fa-solid fa-pen-to-square me-2"></i>
                  Edit Details
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => toast.info("View Documents feature coming soon!")}
                >
                  <i className="fa-solid fa-file-invoice me-2"></i>
                  View Documents
                </button>
              </div>
            </div>
            <div className="row mt-4">
              {basicDetail.map((item, ind) => (
                <div className="col-xl-3 col-xxl-4 col-md-6 mb-4" key={ind}>
                  <div className="card h-100 shadow-sm border-0 mb-0" style={{ background: "#f8f9fa" }}>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className={`${item.icon} text-primary fs-14 me-2`}></i>
                        <span className="text-muted font-w500 fs-13">{item.title}</span>
                      </div>
                      <h5 className="mb-0 font-w600 text-black" style={{ wordBreak: "break-word", lineHeight: 1.4 }}>
                        {item.subtitle}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/*<div className="card h-auto">
          <div className="card-header border-0 p-3">
            <h4 className="heading mb-0">Payment History</h4>
          </div>
          <div className="card-body p-0">
            <PaymentHistoryTable />
          </div>
        </div>*/}
      </div>
      <div className="col-xl-3">
        <div className="row">
          <div className="col-xl-12">
            <div className="card h-auto">
              <div className="card-body">
                <h3 className="heading">Schedule Details</h3>
                <p className="mb-0">Thursday, 10th April , 2022</p>
              </div>
            </div>
          </div>
          {scheduleBlog.map((data, index) => (
            <div className="col-xl-12 col-sm-6" key={index}>
              <div className={`card h-auto ${data.color}`}>
                <div className="card-body">
                  <h4 className="mb-0">{data.title}</h4>
                  <p>{data.subtitle}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <ul>
                        <li className="mb-2">
                          {SVGICON.calndar} July 20, 2023
                        </li>
                        <li>{SVGICON.watch} 09.00 - 10.00 AM</li>
                      </ul>
                    </div>
                    <div />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="col-xl-12">
            <Link
              to={"#"}
              className="btn btn-primary btn-block light btn-rounded mb-5"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
