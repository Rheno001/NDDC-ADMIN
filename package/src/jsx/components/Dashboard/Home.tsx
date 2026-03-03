// import DatePicker from "react-datepicker";

//Import Components

import { useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
/* import { TeacherDetails } from "./Elements/TeacherDetails"; */
import { UnpaidVendorTable } from "./Elements/UnpaidVendorTable";
import VendorActivity from "./Elements/VendorActivity";

const statCards = [
  {
    title: "Total Vendors", value: "93", bg: "bg-primary",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>,
  },
  {
    title: "Pending Approval", value: "87", bg: "bg-warning",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>,
  },
  {
    title: "Approved Vendors", value: "40", bg: "bg-success",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>,
  },
  {
    title: "Rejected Vendors", value: "32", bg: "bg-danger",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>,
  },
  {
    title: "Closed Bids", value: "58", bg: "bg-dark",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>,
  },
  {
    title: "Open Bids", value: "24", bg: "bg-info",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>,
  },
  {
    title: "Admin Accounts", value: "12", bg: "bg-secondary",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.32-2.17 6.44-5 7.59-2.83-1.15-5-4.27-5-7.59V7.18L12 5z" /></svg>,
  },
  {
    title: "Public Accounts", value: "81", bg: "bg-primary",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>,
  },
];

const Home = () => {
  // const [startDate, setStartDate] = useState<null | Date | undefined>(null);
  useEffect(() => {
    document.body.setAttribute("data-theme-version", "light");
  }, []);
  return (
    <>
      <div className="row">
        {statCards.map((card, idx) => (
          <div className="col-xl-3 col-xxl-3 col-lg-6 col-sm-6" key={idx}>
            <div className={`widget-stat card ${card.bg}`}>
              <div className="card-body p-3">
                <div className="media align-items-center">
                  <span className="me-3" style={{ lineHeight: 1, opacity: 0.9, display: "flex" }}>
                    {card.icon}
                  </span>
                  <div className="media-body text-white text-start">
                    <p className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>{card.title}</p>
                    <h3 className="text-white mb-0" style={{ fontSize: "1.6rem", fontWeight: 700 }}>{card.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Vendor Activity Chart */}
      <div className="row mt-4">
        <div className="col-xl-12">
          <div id="vendor-activity" className="card">
            <Tab.Container defaultActiveKey="day">
              <div className="card-header border-0 pb-0 d-sm-flex d-block">
                <h4 className="card-title">Vendor Registration Activity</h4>
                <div className="card-action mb-sm-0 my-2">
                  <Nav className="nav nav-tabs" role="tablist">
                    <Nav.Item className="nav-item">
                      <Nav.Link className="nav-link" data-toggle="tab" role="tab" eventKey="day">
                        Day
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-item">
                      <Nav.Link className="nav-link" data-toggle="tab" role="tab" eventKey="month">
                        Month
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-item">
                      <Nav.Link className="nav-link" data-toggle="tab" role="tab" eventKey="year">
                        Year
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div className="card-body">
                <Tab.Content>
                  <Tab.Pane eventKey="day" role="tabpanel">
                    <VendorActivity dataActive={0} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="month" role="tabpanel">
                    <VendorActivity dataActive={1} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="year" role="tabpanel">
                    <VendorActivity dataActive={2} />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </div>
      </div>
      {/* Active Bids Section */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <h4 className="mb-0 fw-bold">Latest Bids</h4>
          </div>
          <div className="row">
            {[
              {
                title: "Supply of Office Equipment",
                refId: "BID-2024-001",
                deadline: "Mar 20, 2026",
                daysLeft: 17,
                totalDays: 30,
                bg: "bg-primary",
              },
              {
                title: "Construction of Access Road",
                refId: "BID-2024-002",
                deadline: "Mar 28, 2026",
                daysLeft: 25,
                totalDays: 45,
                bg: "bg-success",
              },
              {
                title: "ICT Infrastructure Upgrade",
                refId: "BID-2024-003",
                deadline: "Apr 05, 2026",
                daysLeft: 8,
                totalDays: 20,
                bg: "bg-danger",
              },
            ].map((bid, idx) => {
              const pct = Math.round((bid.daysLeft / bid.totalDays) * 100);
              return (
                <div className="col-xl-4 col-lg-6 col-sm-12" key={idx}>
                  <div className={`widget-stat card ${bid.bg}`} style={{ minHeight: "200px" }}>
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      {/* Top row: icon + ref badge */}
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div style={{
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "10px",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                          </svg>
                        </div>
                        <span className="badge" style={{
                          background: "rgba(255,255,255,0.25)",
                          color: "#fff",
                          fontSize: "0.75rem",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontWeight: 500,
                        }}>
                          {bid.refId}
                        </span>
                      </div>

                      {/* Bid title */}
                      <h4 className="text-white mb-1" style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.4 }}>
                        {bid.title}
                      </h4>

                      {/* Deadline */}
                      <div className="d-flex align-items-center mb-3" style={{ opacity: 0.85 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" className="me-1">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"/>
                        </svg>
                        <small className="text-white">Deadline: {bid.deadline}</small>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-white" style={{ opacity: 0.9 }}>Days Remaining</small>
                          <small className="text-white fw-bold">{pct}%</small>
                        </div>
                        <div className="progress" style={{ height: "8px", background: "rgba(255,255,255,0.25)", borderRadius: "4px" }}>
                          <div
                            className="progress-bar progress-animated bg-white"
                            style={{ width: `${pct}%`, borderRadius: "4px" }}
                          ></div>
                        </div>
                        <small className="text-white mt-1 d-block" style={{ opacity: 0.75 }}>
                          {bid.daysLeft} of {bid.totalDays} days left
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-xl-6 ">
          <div className="card crypto-chart ">
            <div className="card-header pb-0 border-0 flex-wrap">
              <div className="mb-2 mb-sm-0">
                <div className="chart-title mb-3">
                  <h2 className="heading">School Performance</h2>
                </div>
              </div>
              <div className="p-static">
                <div className="d-flex align-items-center mb-3 mb-sm-0">
                  <div className="round weekly" id="dzOldSeries">
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox1"
                        name="radio"
                        value="weekly"
                      />
                      <label htmlFor="checkbox1" className="checkmark"></label>
                    </div>
                    <div>
                      <span className="fs-14">This Week</span>
                      <h4 className="fs-5 font-w700 mb-0">1.245</h4>
                    </div>
                  </div>
                  <div className="round" id="dzNewSeries">
                    <div>
                      <input
                        type="checkbox"
                        id="checkbox"
                        name="radio"
                        value="monthly"
                      />
                      <label htmlFor="checkbox" className="checkmark"></label>
                    </div>
                    <div>
                      <span className="fs-14">Last Week</span>
                      <h4 className="fs-5 font-w700 mb-0">1.356</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body pt-2 custome-tooltip pb-0 px-2">
              <SchoolPerformance />
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card h-auto">
            <SchoolOverView />
          </div>
        </div>
      </div> */}
      {/* <div className="row">
        <div className="col-xl-4 wow fadeInUp" data-wow-delay="1.5s">
          <div className="card">
            <div className="card-header pb-0 border-0 flex-wrap">
              <div>
                <div className="mb-3">
                  <h2 className="heading mb-0">School Calendar</h2>
                </div>
              </div>
            </div>
            <div className="card-body text-center event-calender dz-calender py-0 px-1">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                inline
                fixedHeight
              />
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card">
            <div className="card-header py-3 border-0 px-3">
              <h4 className="heading m-0">Teacher Deatails</h4>
            </div>
            <div className="card-body p-0">
              <TeacherDetails />
            </div>
          </div>
        </div>
      </div> */}
      <div className="col-xl-12">
        <div className="card">
          <div className="card-header border-0 p-3">
            <h4 className="heading mb-0">Total Approved Vendors</h4>
          </div>
          <div className="card-body p-0">
            <UnpaidVendorTable />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
