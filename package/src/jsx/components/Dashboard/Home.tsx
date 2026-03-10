// import DatePicker from "react-datepicker";

//Import Components

import { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
/* import { TeacherDetails } from "./Elements/TeacherDetails"; */
import { UnpaidVendorTable } from "./Elements/UnpaidVendorTable";
import VendorActivity from "./Elements/VendorActivity";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";

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
    title: "Suspended Vendors", value: "32", bg: "bg-danger",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>,
  },
  {
    title: "Total Bids Advertised", value: "45", bg: "bg-dark",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>,
  },
  {
    title: "Open Bids", value: "12", bg: "bg-info",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>,
  },
  {
    title: "Closed Bids", value: "22", bg: "bg-secondary",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>,
  },
  {
    title: "Under Evaluation", value: "11", bg: "bg-warning",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>,
  },
];

type DocStatus = "Pending" | "Approved" | "Rejected" | "Reupload Requested";

const statusStyle: Record<DocStatus, { bg: string; color: string }> = {
  Pending: { bg: "#fff3cd", color: "#856404" },
  Approved: { bg: "#d4edda", color: "#155724" },
  Rejected: { bg: "#f8d7da", color: "#721c24" },
  "Reupload Requested": { bg: "#d1ecf1", color: "#0c5460" },
};

const initialDocs: { vendor: string; doc: string; date: string; status: DocStatus }[] = [
  { vendor: "Zenith Supplies Ltd", doc: "CAC Certificate", date: "Mar 01, 2026", status: "Pending" },
  { vendor: "Horizon Contractors", doc: "Tax Clearance Certificate", date: "Mar 02, 2026", status: "Approved" },
  { vendor: "Alpha Tech Solutions", doc: "Company Profile", date: "Mar 03, 2026", status: "Pending" },
  { vendor: "Bridgewater Ventures", doc: "Bank Statement", date: "Mar 04, 2026", status: "Pending" },
  { vendor: "NovaBuild Enterprises", doc: "Audited Financials", date: "Mar 05, 2026", status: "Approved" },
  { vendor: "Crestview Partners", doc: "PENCOM Clearance", date: "Mar 06, 2026", status: "Pending" },
  { vendor: "Delta Force Supplies", doc: "ITF Clearance", date: "Mar 06, 2026", status: "Pending" },
  { vendor: "Emerald Works Ltd", doc: "CAC Certificate", date: "Mar 06, 2026", status: "Approved" },
];

const bidData = [
  { title: "Supply of Office Equipment", vendors: 8, deadline: "Mar 20, 2026", status: "Open" },
  { title: "Construction of Access Road", vendors: 14, deadline: "Mar 28, 2026", status: "Open" },
  { title: "ICT Infrastructure Upgrade", vendors: 6, deadline: "Apr 05, 2026", status: "Evaluation" },
  { title: "Procurement of Medical Supplies", vendors: 11, deadline: "Feb 28, 2026", status: "Closed" },
  { title: "Renovation of Staff Quarters", vendors: 9, deadline: "Mar 15, 2026", status: "Evaluation" },
  { title: "Supply of Generator Sets", vendors: 5, deadline: "Jan 31, 2026", status: "Closed" },
  { title: "Borehole Drilling Project", vendors: 7, deadline: "Apr 10, 2026", status: "Open" },
  { title: "Supply of Laboratory Equipment", vendors: 3, deadline: "Apr 18, 2026", status: "Open" },
];

const bidStatusStyle: Record<string, { bg: string; color: string }> = {
  Open: { bg: "#d1ecf1", color: "#0c5460" },
  Closed: { bg: "#f8d7da", color: "#721c24" },
  Evaluation: { bg: "#e2d9f3", color: "#4a235a" },
};

const Home = () => {
  // const [startDate, setStartDate] = useState<null | Date | undefined>(null);
  const [docRows, setDocRows] = useState(initialDocs.filter(d => d.status === "Pending"));

  const handleActionChange = (index: number, action: string) => {
    const nextStatus: Record<string, DocStatus> = {
      approve: "Approved",
      reject: "Rejected",
      reupload: "Reupload Requested",
    };
    if (!nextStatus[action]) return;
    // index here is the absolute index within docRows
    setDocRows(prev =>
      prev.map((row, i) => i === index ? { ...row, status: nextStatus[action] } : row)
    );
  };

  const docQueueColumns = useMemo<ColumnDef<any>[]>(() => [
    {
      header: "Vendor",
      accessorKey: "vendor",
      cell: ({ row }: { row: Row<any> }) => <span className="fw-semibold">{row.original.vendor}</span>,
    },
    {
      header: "Document",
      accessorKey: "doc",
    },
    {
      header: "Date Uploaded",
      accessorKey: "date",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: Row<any> }) => {
        const s = statusStyle[row.original.status as DocStatus];
        return (
          <span
            className="badge px-3 py-2"
            style={{ borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, background: s.bg, color: s.color }}
          >
            {row.original.status}
          </span>
        );
      },
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }: { row: Row<any> }) => (
        <select
          className="form-select form-select-sm"
          defaultValue=""
          onChange={(e) => handleActionChange(row.index, e.target.value)}
          style={{ borderRadius: "20px", fontSize: "0.8rem", width: "100%", cursor: "pointer" }}
        >
          <option value="" disabled>Select action…</option>
          <option value="approve">✅ Approve</option>
          <option value="reject">❌ Reject</option>
          <option value="reupload">🔁 Request Reupload</option>
        </select>
      ),
    }
  ], [handleActionChange]);

  const bidOverviewColumns = useMemo<ColumnDef<any>[]>(() => [
    {
      header: "Bid Title",
      accessorKey: "title",
      cell: ({ row }: { row: Row<any> }) => <span className="fw-semibold">{row.original.title}</span>,
    },
    {
      header: "Vendors Submitted",
      accessorKey: "vendors",
      cell: ({ row }: { row: Row<any> }) => (
        <div className="text-center">
          <span className="badge bg-light text-dark px-3 py-2" style={{ borderRadius: "20px", fontWeight: 700, fontSize: "0.85rem" }}>
            {row.original.vendors}
          </span>
        </div>
      ),
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: Row<any> }) => {
        const s = bidStatusStyle[row.original.status] ?? { bg: "#eee", color: "#333" };
        return (
          <span
            className="badge px-3 py-2"
            style={{ borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, background: s.bg, color: s.color }}
          >
            {row.original.status}
          </span>
        );
      },
    },
  ], []);

  const rankedVendorColumns = useMemo<ColumnDef<any>[]>(() => [
    {
      header: "Rank",
      accessorKey: "rank",
      cell: ({ row }: { row: Row<any> }) => {
        const medal: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
        return <span style={{ fontSize: "1.1rem" }}>{medal[row.original.rank] ?? `#${row.original.rank}`}</span>;
      },
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
      cell: ({ row }: { row: Row<any> }) => <span className="fw-semibold">{row.original.vendor}</span>,
    },
    {
      header: "Bid",
      accessorKey: "bid",
    },
    {
      header: "Score",
      accessorKey: "score",
      cell: ({ row }: { row: Row<any> }) => {
        const scoreColor = row.original.score >= 90 ? "#155724" : row.original.score >= 80 ? "#0c5460" : "#856404";
        const scoreBg = row.original.score >= 90 ? "#d4edda" : row.original.score >= 80 ? "#d1ecf1" : "#fff3cd";
        return (
          <div className="text-center">
            <span
              className="badge px-3 py-2"
              style={{ borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700, background: scoreBg, color: scoreColor }}
            >
              {row.original.score}
            </span>
          </div>
        );
      },
    },
  ], []);

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

      {/* Compliance Monitoring Cards */}
      <h4 className="card-title text-muted fw-bold mt-2 mb-3" style={{ fontSize: "1.1rem" }}>Compliance Monitoring</h4>
      <div className="row">
        {[
          {
            title: "Vendors with expired documents", value: 132, bg: "bg-danger",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>,
          },
          {
            title: "Documents awaiting verification", value: 210, bg: "bg-warning",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z" /></svg>,
          },
          {
            title: "Rejected documents", value: 54, bg: "bg-dark",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>,
          },
        ].map((card, idx) => (
          <div className="col-xl-4 col-sm-4" key={idx}>
            <div className={`widget-stat card ${card.bg}`}>
              <div className="card-body p-3">
                <div className="media align-items-center flex-wrap">
                  <span className="me-3" style={{ lineHeight: 1, opacity: 0.9, display: "flex" }}>
                    {card.icon}
                  </span>
                  <div className="media-body text-white text-start flex-grow-1">
                    <p className="mb-0 text-white" style={{ fontSize: "0.9rem", lineHeight: 1.3 }}>{card.title}</p>
                    <h3 className="text-white mb-0 mt-2" style={{ fontSize: "1.6rem", fontWeight: 700 }}>{card.value}</h3>
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
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z" />
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

      {/* Vendor Document Verification Queue */}
      <div className="col-xl-12 mt-4">
        <div className="card">
          <div className="card-header border-0 p-3 d-flex align-items-center justify-content-between">
            <h4 className="heading mb-0">Vendor Document Verification Queue</h4>
            <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: "0.8rem", borderRadius: "20px" }}>
              Pending Review
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive basic-tbl">
              <div id="doc-queue-table_wrapper" className="dataTables_wrapper no-footer">
                <TanStackTable
                  data={docRows}
                  columns={docQueueColumns}
                  enableSelection={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Submissions Overview */}
      <div className="col-xl-12 mt-4">
        <div className="card">
          <div className="card-header border-0 p-3 d-flex align-items-center justify-content-between">
            <h4 className="heading mb-0">Bid Submissions Overview</h4>
            <span className="badge bg-primary px-3 py-2" style={{ fontSize: "0.8rem", borderRadius: "20px" }}>
              All Bids
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive basic-tbl">
              <div id="bid-overview-table_wrapper" className="dataTables_wrapper no-footer">
                <TanStackTable
                  data={bidData}
                  columns={bidOverviewColumns}
                  enableSelection={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Top Ranked Vendors */}
      <div className="col-xl-12 mt-4">
        <div className="card">
          <div className="card-header border-0 p-3 d-flex align-items-center justify-content-between">
            <h4 className="heading mb-0">Top Ranked Vendors</h4>
            <span className="badge bg-success px-3 py-2" style={{ fontSize: "0.8rem", borderRadius: "20px" }}>
              Highest Scores
            </span>
          </div>
          <div className="card-body pt-0">

            {/* Active Bid Summary Cards */}
            <div className="row mb-3">
              {[
                { bid: "Road Infrastructure Project", vendors: 24, deadline: "10 Jul", status: "Open", statusBg: "#d1ecf1", statusColor: "#0c5460" },
                { bid: "ICT Systems Upgrade", vendors: 18, deadline: "15 Jul", status: "Evaluation", statusBg: "#e2d9f3", statusColor: "#4a235a" },
              ].map((b, i) => (
                <div className="col-md-6" key={i}>
                  <div className="p-3 rounded mb-2" style={{ background: "#f8f9fa", border: "1px solid #eee" }}>
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div>
                        <p className="mb-1 fw-semibold" style={{ fontSize: "0.9rem" }}>{b.bid}</p>
                        <span className="text-muted" style={{ fontSize: "0.82rem" }}>Vendors Submitted: <strong>{b.vendors}</strong></span>
                      </div>
                      <div className="text-end">
                        <p className="mb-1 text-muted" style={{ fontSize: "0.82rem" }}>Deadline: <strong>{b.deadline}</strong></p>
                        <span
                          className="badge px-3 py-1"
                          style={{ borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, background: b.statusBg, color: b.statusColor }}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ranked Table */}
            <div className="table-responsive">
              <div id="ranked-vendors-table_wrapper" className="dataTables_wrapper no-footer">
                <TanStackTable
                  data={[
                    { rank: 1, vendor: "ABC Construction", bid: "Road Project", score: 91 },
                    { rank: 2, vendor: "Zenith Infrastructure", bid: "ICT Project", score: 87 },
                    { rank: 3, vendor: "Omega Tech", bid: "ICT Project", score: 84 },
                    { rank: 4, vendor: "Crestview Partners", bid: "Road Project", score: 80 },
                    { rank: 5, vendor: "Delta Force Supplies", bid: "Road Project", score: 77 },
                  ]}
                  columns={rankedVendorColumns}
                  enableSelection={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
