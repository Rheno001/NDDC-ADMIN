import { Link } from "react-router-dom";
import { SVGICON } from "../Dashboard/Content";
import { Dropdown } from "react-bootstrap";
import PaymentHistoryTable from "./PaymentHistoryTable";



interface scheduleBlogType {
  title: string;
  subtitle: string;
  color: string;
}
interface basicDetailType {
  title: string;
  subtitle: string;
}
const scheduleBlog: scheduleBlogType[] = [
  { title: "Basic Algorithm", subtitle: "Algorithm", color: "schedule-card" },
  { title: "Basic Art", subtitle: "Art", color: "schedule-card-1" },
  { title: "React & Scss", subtitle: "Programming", color: "schedule-card-2" },
  { title: "Simple Past Tense", subtitle: "English", color: "schedule-card-3" },
];

const basicDetail: basicDetailType[] = [
  { title: "Parents", subtitle: "Justin Hope" },
  { title: "Address", subtitle: "Jakarta, Indonesia" },
  { title: "Phone", subtitle: "+12 345 6789 0" },
  { title: "Email", subtitle: "Historia@mail.com" },
];

const VendorDetails = () => {
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
            <div className="d-flex justify-content-between">
              <div className="user">
                <div className="user-media">
                  <div className="avatar avatar-xxl bg-primary d-flex align-items-center justify-content-center text-white" style={{ fontSize: "2rem", fontWeight: 700 }}>KH</div>
                </div>
                <div>
                  <h2 className="mb-0">Karen Hope</h2>
                  <p className="text-primary font-w600">Vendor</p>
                </div>
              </div>
              <Dropdown className="custom-dropdown">
                <Dropdown.Toggle as="div" className="i-false btn sharp tp-btn ">
                  {SVGICON.dots}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end" align="end">
                  <Dropdown.Item>Option 1</Dropdown.Item>
                  <Dropdown.Item>Option 2</Dropdown.Item>
                  <Dropdown.Item>Option 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="row mt-2">
              {basicDetail.map((item, ind) => (
                <div className="col-xl-3 col-xxl-6 col-sm-6" key={ind}>
                  <ul className="vendor-details">
                    <li className="me-2">
                      <span className="icon-box bg-secondary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                    </li>
                    <li>
                      <span>{item.title}:</span>
                      <h5 className="mb-0">{item.subtitle}</h5>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card h-auto">
          <div className="card-header border-0 p-3">
            <h4 className="heading mb-0">Payment History</h4>
          </div>
          <div className="card-body p-0">
            <PaymentHistoryTable />
          </div>
        </div>
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
