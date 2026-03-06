import { useState } from "react";
import { Link } from "react-router-dom";

type DocStatus = "Submitted" | "Pending" | "Missing";

interface RequiredDoc {
    doc: string;
    vendor: string;
    submitted: string;
    status: DocStatus;
}

const docStatusStyle: Record<DocStatus, { bg: string; color: string }> = {
    Submitted: { bg: "#d4edda", color: "#155724" },
    Pending: { bg: "#fff3cd", color: "#856404" },
    Missing: { bg: "#f8d7da", color: "#721c24" },
};

const requiredDocs: RequiredDoc[] = [
    { doc: "CAC Certificate", vendor: "Zenith Supplies Ltd", submitted: "Mar 01, 2026", status: "Submitted" },
    { doc: "Tax Clearance Certificate", vendor: "Horizon Contractors", submitted: "Mar 02, 2026", status: "Submitted" },
    { doc: "Company Profile", vendor: "Alpha Tech Solutions", submitted: "—", status: "Pending" },
    { doc: "Bank Statement", vendor: "Bridgewater Ventures", submitted: "—", status: "Missing" },
    { doc: "Audited Financials", vendor: "NovaBuild Enterprises", submitted: "Mar 05, 2026", status: "Submitted" },
    { doc: "PENCOM Clearance", vendor: "Crestview Partners", submitted: "—", status: "Pending" },
    { doc: "ITF Clearance", vendor: "Delta Force Supplies", submitted: "Mar 06, 2026", status: "Submitted" },
    { doc: "Company Profile", vendor: "Emerald Works Ltd", submitted: "—", status: "Missing" },
    { doc: "CAC Certificate", vendor: "Summit Holdings", submitted: "Mar 03, 2026", status: "Submitted" },
    { doc: "Tax Clearance Certificate", vendor: "Pinnacle Group", submitted: "—", status: "Pending" },
];

const recordsPage = 5;

const BidEvaluation = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
    const records = requiredDocs.slice(firstIndex, lastIndex);
    const npage = Math.ceil(requiredDocs.length / recordsPage);
    const number = [...Array(npage + 1).keys()].slice(1);

    function prePage() { if (currentPage !== 1) setCurrentPage(p => p - 1); }
    function nextPage() { if (currentPage !== npage) setCurrentPage(p => p + 1); }

    const totalVendors = 18;
    const evaluated = 10;
    const pending = totalVendors - evaluated;
    const progressPct = Math.round((evaluated / totalVendors) * 100);

    return (
        <>
            {/* Breadcrumb */}
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/bids">Bids</Link>
                    </li>
                    <li className="breadcrumb-item active">Evaluation Dashboard</li>
                </ol>
            </div>

            {/* Bid Header Card */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="mb-1 text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bid Reference</p>
                                <h3 className="mb-0 fw-bold" style={{ fontSize: "1.4rem" }}>NDDC-ICT-2026</h3>
                                <p className="mb-0 text-muted mt-1">ICT Infrastructure Upgrade</p>
                            </div>
                            <div className="d-flex gap-2">
                                <span className="badge bg-warning text-dark px-3 py-2" style={{ borderRadius: "20px", fontSize: "0.85rem" }}>
                                    Under Evaluation
                                </span>
                                <span className="badge bg-light text-muted px-3 py-2" style={{ borderRadius: "20px", fontSize: "0.85rem" }}>
                                    Deadline: Apr 05, 2026
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="row">
                {[
                    {
                        label: "Vendors Submitted", value: totalVendors, bg: "bg-primary",
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>,
                    },
                    {
                        label: "Evaluated", value: evaluated, bg: "bg-success",
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>,
                    },
                    {
                        label: "Pending Evaluation", value: pending, bg: "bg-warning",
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>,
                    },
                    {
                        label: "Documents Required", value: requiredDocs.length, bg: "bg-info",
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>,
                    },
                ].map((card, i) => (
                    <div className="col-xl-3 col-lg-6 col-sm-6" key={i}>
                        <div className={`widget-stat card ${card.bg}`}>
                            <div className="card-body p-3">
                                <div className="media align-items-center">
                                    <span className="me-3" style={{ lineHeight: 1, opacity: 0.9, display: "flex" }}>
                                        {card.icon}
                                    </span>
                                    <div className="media-body text-white text-start">
                                        <p className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>{card.label}</p>
                                        <h3 className="text-white mb-0" style={{ fontSize: "1.6rem", fontWeight: 700 }}>{card.value}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Evaluation Progress */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header border-0 p-3">
                            <h4 className="heading mb-0">Evaluation Progress</h4>
                        </div>
                        <div className="card-body pt-0">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                                    {evaluated} of {totalVendors} vendors evaluated
                                </span>
                                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{progressPct}%</span>
                            </div>
                            <div className="progress" style={{ height: "12px", borderRadius: "6px", background: "#e9ecef" }}>
                                <div
                                    className="progress-bar bg-success progress-animated"
                                    style={{ width: `${progressPct}%`, borderRadius: "6px" }}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-3 flex-wrap gap-3">
                                {[
                                    { label: "Submitted", count: requiredDocs.filter(d => d.status === "Submitted").length, color: "#155724", bg: "#d4edda" },
                                    { label: "Pending", count: requiredDocs.filter(d => d.status === "Pending").length, color: "#856404", bg: "#fff3cd" },
                                    { label: "Missing", count: requiredDocs.filter(d => d.status === "Missing").length, color: "#721c24", bg: "#f8d7da" },
                                ].map((s, i) => (
                                    <div key={i} className="d-flex align-items-center gap-2">
                                        <span style={{ width: 12, height: 12, borderRadius: "50%", background: s.bg, border: `2px solid ${s.color}`, display: "inline-block" }} />
                                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>{s.label}: <strong style={{ color: s.color }}>{s.count}</strong></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header border-0 p-3 d-flex align-items-center justify-content-between">
                            <h4 className="heading mb-0">Documents to be Submitted</h4>
                            <span className="badge bg-secondary px-3 py-2" style={{ borderRadius: "20px", fontSize: "0.8rem" }}>
                                {requiredDocs.length} documents
                            </span>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive full-data">
                                <div id="bid-docs_wrapper" className="dataTables_wrapper no-footer">
                                    <table className="table-responsive-lg table display dataTablesCard vendor-tab dataTable no-footer">
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Document</th>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Vendor</th>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Date Submitted</th>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.map((row, i) => {
                                                const s = docStatusStyle[row.status];
                                                return (
                                                    <tr key={i}>
                                                        <td><span className="font-w600">{row.doc}</span></td>
                                                        <td>{row.vendor}</td>
                                                        <td className="text-muted">{row.submitted}</td>
                                                        <td>
                                                            <span
                                                                className="badge px-3 py-2"
                                                                style={{ borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600, background: s.bg, color: s.color }}
                                                            >
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to{" "}
                                            {requiredDocs.length < lastIndex ? requiredDocs.length : lastIndex} of{" "}
                                            {requiredDocs.length} entries
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers justify-content-center"
                                            id="bid-docs_paginate"
                                        >
                                            <Link className="paginate_button previous disabled" to="#" onClick={prePage}>
                                                <i className="fa-solid fa-angle-left" />
                                            </Link>
                                            <span>
                                                {number.map((n, i) => (
                                                    <Link
                                                        to={"#"}
                                                        className={`paginate_button ${currentPage === n ? "current" : ""} `}
                                                        key={i}
                                                        onClick={() => setCurrentPage(n)}
                                                    >
                                                        {n}
                                                    </Link>
                                                ))}
                                            </span>
                                            <Link className="paginate_button next" to="#" onClick={nextPage}>
                                                <i className="fa-solid fa-angle-right" />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BidEvaluation;
