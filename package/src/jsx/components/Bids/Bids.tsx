import { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

type BidStatus = "Open" | "Closed" | "Under Evaluation";

interface BidRow {
    id: string;
    title: string;
    deadline: string;
    status: BidStatus;
}

const bidData: BidRow[] = [
    { id: "BID-2026-001", title: "Supply of Office Equipment", deadline: "Mar 20, 2026", status: "Open" },
    { id: "BID-2026-002", title: "Construction of Access Road", deadline: "Mar 28, 2026", status: "Open" },
    { id: "BID-2026-003", title: "ICT Infrastructure Upgrade", deadline: "Apr 05, 2026", status: "Under Evaluation" },
    { id: "BID-2026-004", title: "Procurement of Medical Supplies", deadline: "Feb 28, 2026", status: "Closed" },
    { id: "BID-2026-005", title: "Renovation of Staff Quarters", deadline: "Mar 15, 2026", status: "Under Evaluation" },
    { id: "BID-2026-006", title: "Supply of Generator Sets", deadline: "Jan 31, 2026", status: "Closed" },
    { id: "BID-2026-007", title: "Borehole Drilling Project", deadline: "Apr 10, 2026", status: "Open" },
    { id: "BID-2026-008", title: "Supply of Laboratory Equipment", deadline: "Apr 18, 2026", status: "Open" },
    { id: "BID-2026-009", title: "Construction of Admin Block", deadline: "May 01, 2026", status: "Open" },
    { id: "BID-2026-010", title: "Procurement of Vehicles", deadline: "Apr 25, 2026", status: "Under Evaluation" },
    { id: "BID-2026-011", title: "Supply of PPE", deadline: "Mar 10, 2026", status: "Closed" },
    { id: "BID-2026-012", title: "Road Rehabilitation Works", deadline: "May 15, 2026", status: "Open" },
];

const statusBadge: Record<BidStatus, { badge: string; text: string }> = {
    "Open": { badge: "badge-info", text: "Open" },
    "Closed": { badge: "badge-danger", text: "Closed" },
    "Under Evaluation": { badge: "badge-warning", text: "Under Evaluation" },
};

const Bids = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPage = 8;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
    const records = bidData.slice(firstIndex, lastIndex);
    const npage = Math.ceil(bidData.length / recordsPage);
    const number = [...Array(npage + 1).keys()].slice(1);

    function prePage() {
        if (currentPage !== 1) setCurrentPage(currentPage - 1);
    }
    function changeCPage(id: number) {
        setCurrentPage(id);
    }
    function nextPage() {
        if (currentPage !== npage) setCurrentPage(currentPage + 1);
    }

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row">
                        {/* Page header */}
                        <div className="col-xl-12">
                            <div className="page-title flex-wrap">
                                <div className="input-group search-area mb-md-0 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search bids..."
                                    />
                                    <span className="input-group-text">
                                        <Link to={"#"}>
                                            <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.5605 15.4395L13.7527 11.6317C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6317 13.7527L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9747 18.1462 16.0252 17.5605 15.4395V15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5V7.5Z" fill="#01A3FF" />
                                            </svg>
                                        </Link>
                                    </span>
                                </div>
                                <div className="d-flex">
                                    <Dropdown className="drop-select me-3">
                                        <Dropdown.Toggle as="div" className="drop-select-btn">
                                            All Statuses
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item>All</Dropdown.Item>
                                            <Dropdown.Item>Open</Dropdown.Item>
                                            <Dropdown.Item>Closed</Dropdown.Item>
                                            <Dropdown.Item>Under Evaluation</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Link to="#" className="btn btn-primary">
                                        + New Bid
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="col-xl-12 wow fadeInUp" data-wow-delay="1.5s">
                            <div className="table-responsive full-data">
                                <div id="example-bids_wrapper" className="dataTables_wrapper no-footer">
                                    <table
                                        className="table-responsive-lg table display dataTablesCard vendor-tab dataTable no-footer"
                                        id="example-bids"
                                    >
                                        <thead>
                                            <tr>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Bid Title</th>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Bid ID</th>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Deadline</th>
                                                <th style={{ fontSize: "1rem", fontWeight: 700 }}>Status</th>
                                                <th className="text-end" style={{ fontSize: "1rem", fontWeight: 700 }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.map((item, ind) => {
                                                const { badge, text } = statusBadge[item.status];
                                                return (
                                                    <tr key={ind}>
                                                        <td>
                                                            <div className="trans-list">
                                                                <Link to="/bid-evaluation">
                                                                    <h6 className="mb-0 font-w600 text-primary">{item.title}</h6>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="text-primary font-w600">{item.id}</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-w500">{item.deadline}</span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-${badge.replace("badge-", "")} light`}>
                                                                {text}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <Dropdown className="custom-dropdown">
                                                                <Dropdown.Toggle className="i-false btn sharp tp-btn" as="div">
                                                                    <svg width="24" height="6" viewBox="0 0 24 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12.0012 0.359985C11.6543 0.359985 11.3109 0.428302 10.9904 0.561035C10.67 0.693767 10.3788 0.888317 10.1335 1.13358C9.88829 1.37883 9.69374 1.67 9.56101 1.99044C9.42828 2.31089 9.35996 2.65434 9.35996 3.00119C9.35996 3.34803 9.42828 3.69148 9.56101 4.01193C9.69374 4.33237 9.88829 4.62354 10.1335 4.8688C10.3788 5.11405 10.67 5.3086 10.9904 5.44134C11.3109 5.57407 11.6543 5.64239 12.0012 5.64239C12.7017 5.64223 13.3734 5.36381 13.8686 4.86837C14.3638 4.37294 14.6419 3.70108 14.6418 3.00059C14.6416 2.3001 14.3632 1.62836 13.8677 1.13315C13.3723 0.637942 12.7004 0.359826 12 0.359985H12.0012ZM3.60116 0.359985C3.25431 0.359985 2.91086 0.428302 2.59042 0.561035C2.26997 0.693767 1.97881 0.888317 1.73355 1.13358C1.48829 1.37883 1.29374 1.67 1.16101 1.99044C1.02828 2.31089 0.959961 2.65434 0.959961 3.00119C0.959961 3.34803 1.02828 3.69148 1.16101 4.01193C1.29374 4.33237 1.48829 4.62354 1.73355 4.8688C1.97881 5.11405 2.26997 5.3086 2.59042 5.44134C2.91086 5.57407 3.25431 5.64239 3.60116 5.64239C4.30165 5.64223 4.97339 5.36381 5.4686 4.86837C5.9638 4.37294 6.24192 3.70108 6.24176 3.00059C6.2416 2.3001 5.96318 1.62836 5.46775 1.13315C4.97231 0.637942 4.30045 0.359826 3.59996 0.359985H3.60116ZM20.4012 0.359985C20.0543 0.359985 19.7109 0.428302 19.3904 0.561035C19.07 0.693767 18.7788 0.888317 18.5336 1.13358C18.2883 1.37883 18.0937 1.67 17.961 1.99044C17.8283 2.31089 17.76 2.65434 17.76 3.00119C17.76 3.34803 17.8283 3.69148 17.961 4.01193C18.0937 4.33237 18.2883 4.62354 18.5336 4.8688C18.7788 5.11405 19.07 5.3086 19.3904 5.44134C19.7109 5.57407 20.0543 5.64239 20.4012 5.64239C21.1017 5.64223 21.7734 5.36381 22.2686 4.86837C22.7638 4.37294 23.0419 3.70108 23.0418 3.00059C23.0416 2.3001 22.7632 1.62836 22.2677 1.13315C21.7723 0.637942 21.1005 0.359826 20.4 0.359985H20.4012Z" fill="#A098AE" />
                                                                    </svg>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdown-menu-end" align="end">
                                                                    <Dropdown.Item>View Details</Dropdown.Item>
                                                                    <Dropdown.Item>Edit Bid</Dropdown.Item>
                                                                    <Dropdown.Item>Mark as Closed</Dropdown.Item>
                                                                    <Dropdown.Item>Mark as Under Evaluation</Dropdown.Item>
                                                                    <Dropdown.Item className="text-danger">Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
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
                                            {bidData.length < lastIndex ? bidData.length : lastIndex} of{" "}
                                            {bidData.length} entries
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers justify-content-center"
                                            id="example-bids_paginate"
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
                                                        onClick={() => changeCPage(n)}
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

export default Bids;
