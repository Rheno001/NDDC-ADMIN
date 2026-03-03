import { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

interface tableDataType {
  id: string;
  initials: string;
  companyName: string;
  rcNumber: string;
  category: string;
  registration: string;
  status: string;
}

const tableData: tableDataType[] = [
  { id: "1", initials: "TS", companyName: "Tech Solutions Ltd", rcNumber: "RC 1234567911", category: "Software Services", registration: "Public", status: "Approved" },
  { id: "2", initials: "KL", companyName: "Karen Logistics", rcNumber: "RC 1234567101", category: "Transportation", registration: "Admin", status: "Approved" },
  { id: "3", initials: "AC", companyName: "Adja Consulting Group", rcNumber: "RC 1234567001", category: "Consultancy", registration: "Public", status: "Approved" },
  { id: "4", initials: "BC", companyName: "Brown & Co Engineering", rcNumber: "RC 1234567231", category: "Engineering", registration: "Admin", status: "Approved" },
  { id: "5", initials: "XH", companyName: "Xarma Holdings", rcNumber: "RC 1234567456", category: "Real Estate", registration: "Public", status: "Approved" },
  { id: "9", initials: "OE", companyName: "Oceanic Enterprises", rcNumber: "RC 9876543210", category: "General Contracts", registration: "Public", status: "Approved" },
  { id: "10", initials: "AI", companyName: "Apex Innovations", rcNumber: "RC 4567891230", category: "IT Equipment", registration: "Admin", status: "Approved" },
  { id: "6", initials: "GE", companyName: "Green Earth Agro", rcNumber: "RC 1122334455", category: "Agriculture", registration: "Public", status: "Approved" },
  { id: "7", initials: "SD", companyName: "Swift Delivery Services", rcNumber: "RC 5566778899", category: "Logistics", registration: "Admin", status: "Approved" },
  { id: "8", initials: "BS", companyName: "Bright Sparks Electricals", rcNumber: "RC 2233445566", category: "Electricals", registration: "Public", status: "Approved" },
];
export const UnpaidVendorTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPage: number = 5;
  const lastIndex: number = currentPage * recordsPage;
  const firstIndex: number = lastIndex - recordsPage;
  const records: tableDataType[] = tableData.slice(firstIndex, lastIndex);
  const npage: number = Math.ceil(tableData.length / recordsPage);
  const number: number[] = [...Array(npage + 1).keys()].slice(1);
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id: number) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
  return (
    <div className="table-responsive basic-tbl">
      <div id="teacher-table_wrapper" className="dataTables_wrapper no-footer">
        <table id="example-1" className="display dataTable no-footer w-100">
          <thead>
            <tr>
              <th style={{ fontWeight: 700, fontSize: "1rem" }}>Company Name</th>
              <th style={{ fontWeight: 700, fontSize: "1rem" }}>RC Number</th>
              <th style={{ fontWeight: 700, fontSize: "1rem" }}>Category</th>
              <th style={{ fontWeight: 700, fontSize: "1rem" }}>Registration</th>
              <th style={{ fontWeight: 700, fontSize: "1rem" }}>Status</th>
              <th style={{ fontWeight: 700, fontSize: "1rem" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, ind) => (
              <tr key={ind}>
                <td>
                  <div className="trans-list d-flex align-items-center">
                    <div
                      className="avatar avatar-sm me-3 bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ borderRadius: "50%", fontSize: "0.75rem", minWidth: 36, height: 36 }}
                    >
                      {item.initials}
                    </div>
                    <span style={{ fontWeight: 400 }}>{item.companyName}</span>
                  </div>
                </td>
                <td>
                  <span className="text-primary">{item.rcNumber}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="ms-2">
                      <span className="text-primary mb-0">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="px-2">{item.registration}</span>
                </td>
                <td>
                  <span className="badge badge-success light">{item.status}</span>
                </td>
                <td>
                  <ul className="tbl-action">
                    <li>
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_6_400-6)">
                            <path
                              d="M23 19H18.93C18.6648 19 18.4104 18.8946 18.2229 18.7071C18.0354 18.5196 17.93 18.2652 17.93 18V15H6V18C6 18.2652 5.89464 18.5196 5.70711 18.7071C5.51957 18.8946 5.26522 19 5 19H1C0.734784 19 0.48043 18.8946 0.292893 18.7071C0.105357 18.5196 0 18.2652 0 18V8C0 7.20435 0.31607 6.44129 0.87868 5.87868C1.44129 5.31607 2.20435 5 3 5H21C21.7956 5 22.5587 5.31607 23.1213 5.87868C23.6839 6.44129 24 7.20435 24 8V18C24 18.2652 23.8946 18.5196 23.7071 18.7071C23.5196 18.8946 23.2652 19 23 19ZM19.93 17H22V8C22.0015 7.86827 21.9766 7.73757 21.9269 7.61558C21.8771 7.49359 21.8035 7.38276 21.7104 7.28961C21.6172 7.19646 21.5064 7.12285 21.3844 7.07312C21.2624 7.02339 21.1317 6.99853 21 7H3C2.86827 6.99853 2.73757 7.02339 2.61558 7.07312C2.49359 7.12285 2.38276 7.19646 2.28961 7.28961C2.19646 7.38276 2.12285 7.49359 2.07312 7.61558C2.02339 7.73757 1.99853 7.86827 2 8V17H4V14C4 13.7348 4.10536 13.4804 4.29289 13.2929C4.48043 13.1054 4.73478 13 5 13H18.93C19.1952 13 19.4496 13.1054 19.6371 13.2929C19.8246 13.4804 19.93 13.7348 19.93 14V17Z"
                              fill="#A098AE"
                            />
                            <path
                              d="M18.9331 7H5.00012C4.73491 7 4.48055 6.89464 4.29302 6.70711C4.10548 6.51957 4.00012 6.26522 4.00012 6V1C4.00012 0.734784 4.10548 0.48043 4.29302 0.292893C4.48055 0.105357 4.73491 0 5.00012 0L18.9331 0C19.1983 0 19.4527 0.105357 19.6402 0.292893C19.8278 0.48043 19.9331 0.734784 19.9331 1V6C19.9331 6.26522 19.8278 6.51957 19.6402 6.70711C19.4527 6.89464 19.1983 7 18.9331 7ZM6.00012 5H17.9331V2H6.00012V5ZM17.0331 24H6.90012C6.13099 24 5.39337 23.6945 4.84951 23.1506C4.30566 22.6068 4.00012 21.8691 4.00012 21.1V14C4.00012 13.7348 4.10548 13.4804 4.29302 13.2929C4.48055 13.1054 4.73491 13 5.00012 13H18.9301C19.1953 13 19.4497 13.1054 19.6372 13.2929C19.8248 13.4804 19.9301 13.7348 19.9301 14V21.1C19.9301 21.8686 19.625 22.6058 19.0818 23.1495C18.5386 23.6933 17.8017 23.9992 17.0331 24ZM6.00012 15V21.1C6.00012 21.3387 6.09494 21.5676 6.26373 21.7364C6.43251 21.9052 6.66143 22 6.90012 22H17.0331C17.2718 22 17.5007 21.9052 17.6695 21.7364C17.8383 21.5676 17.9331 21.3387 17.9331 21.1V15H6.00012ZM20.0001 10H19.0001C18.7349 10 18.4806 9.89464 18.293 9.70711C18.1055 9.51957 18.0001 9.26522 18.0001 9C18.0001 8.73478 18.1055 8.48043 18.293 8.29289C18.4806 8.10536 18.7349 8 19.0001 8H20.0001C20.2653 8 20.5197 8.10536 20.7072 8.29289C20.8948 8.48043 21.0001 8.73478 21.0001 9C21.0001 9.26522 20.8948 9.51957 20.7072 9.70711C20.5197 9.89464 20.2653 10 20.0001 10Z"
                              fill="#A098AE"
                            />
                            <path
                              d="M14.9999 18H8.99988C8.73466 18 8.48031 17.8946 8.29277 17.7071C8.10523 17.5196 7.99988 17.2652 7.99988 17C7.99988 16.7348 8.10523 16.4804 8.29277 16.2929C8.48031 16.1054 8.73466 16 8.99988 16H14.9999C15.2651 16 15.5194 16.1054 15.707 16.2929C15.8945 16.4804 15.9999 16.7348 15.9999 17C15.9999 17.2652 15.8945 17.5196 15.707 17.7071C15.5194 17.8946 15.2651 18 14.9999 18ZM11.9999 21H8.99988C8.73466 21 8.48031 20.8946 8.29277 20.7071C8.10523 20.5196 7.99988 20.2652 7.99988 20C7.99988 19.7348 8.10523 19.4804 8.29277 19.2929C8.48031 19.1054 8.73466 19 8.99988 19H11.9999C12.2651 19 12.5194 19.1054 12.707 19.2929C12.8945 19.4804 12.9999 19.7348 12.9999 20C12.9999 20.2652 12.8945 20.5196 12.707 20.7071C12.5194 20.8946 12.2651 21 11.9999 21Z"
                              fill="#A098AE"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_6_400-6">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <Dropdown className="custom-dropdown ">
                          <Dropdown.Toggle
                            as="div"
                            className="btn sharp tp-btn i-false"
                          >
                            <svg
                              width="18"
                              height="6"
                              viewBox="0 0 24 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.0012 0.359985C11.6543 0.359985 11.3109 0.428302 10.9904 0.561035C10.67 0.693767 10.3788 0.888317 10.1335 1.13358C9.88829 1.37883 9.69374 1.67 9.56101 1.99044C9.42828 2.31089 9.35996 2.65434 9.35996 3.00119C9.35996 3.34803 9.42828 3.69148 9.56101 4.01193C9.69374 4.33237 9.88829 4.62354 10.1335 4.8688C10.3788 5.11405 10.67 5.3086 10.9904 5.44134C11.3109 5.57407 11.6543 5.64239 12.0012 5.64239C12.7017 5.64223 13.3734 5.36381 13.8686 4.86837C14.3638 4.37294 14.6419 3.70108 14.6418 3.00059C14.6416 2.3001 14.3632 1.62836 13.8677 1.13315C13.3723 0.637942 12.7004 0.359826 12 0.359985H12.0012ZM3.60116 0.359985C3.25431 0.359985 2.91086 0.428302 2.59042 0.561035C2.26997 0.693767 1.97881 0.888317 1.73355 1.13358C1.48829 1.37883 1.29374 1.67 1.16101 1.99044C1.02828 2.31089 0.959961 2.65434 0.959961 3.00119C0.959961 3.34803 1.02828 3.69148 1.16101 4.01193C1.29374 4.33237 1.48829 4.62354 1.73355 4.8688C1.97881 5.11405 2.26997 5.3086 2.59042 5.44134C2.91086 5.57407 3.25431 5.64239 3.60116 5.64239C4.30165 5.64223 4.97339 5.36381 5.4686 4.86837C5.9638 4.37294 6.24192 3.70108 6.24176 3.00059C6.2416 2.3001 5.96318 1.62836 5.46775 1.13315C4.97231 0.637942 4.30045 0.359826 3.59996 0.359985H3.60116ZM20.4012 0.359985C20.0543 0.359985 19.7109 0.428302 19.3904 0.561035C19.07 0.693767 18.7788 0.888317 18.5336 1.13358C18.2883 1.37883 18.0937 1.67 17.961 1.99044C17.8283 2.31089 17.76 2.65434 17.76 3.00119C17.76 3.34803 17.8283 3.69148 17.961 4.01193C18.0937 4.33237 18.2883 4.62354 18.5336 4.8688C18.7788 5.11405 19.07 5.3086 19.3904 5.44134C19.7109 5.57407 20.0543 5.64239 20.4012 5.64239C21.1017 5.64223 21.7734 5.36381 22.2686 4.86837C22.7638 4.37294 23.0419 3.70108 23.0418 3.00059C23.0416 2.3001 22.7632 1.62836 22.2677 1.13315C21.7723 0.637942 21.1005 0.359826 20.4 0.359985H20.4012Z"
                                fill="#A098AE"
                              />
                            </svg>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
                            <Dropdown.Item>Draft</Dropdown.Item>
                            <Dropdown.Item>Invited</Dropdown.Item>
                            <Dropdown.Item>Pending Activation</Dropdown.Item>
                            <Dropdown.Item>Active</Dropdown.Item>
                            <Dropdown.Item>Suspended</Dropdown.Item>
                            <Dropdown.Item>Blacklisted</Dropdown.Item>
                            <Dropdown.Item>Archived</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-sm-flex text-center justify-content-between align-items-center">
          <div className="dataTables_info">
            Showing {lastIndex - recordsPage + 1} to{" "}
            {tableData.length < lastIndex ? tableData.length : lastIndex} of{" "}
            {tableData.length} entries
          </div>
          <div
            className="dataTables_paginate paging_simple_numbers justify-content-center"
            id="example2_paginate"
          >
            <Link
              className="paginate_button previous disabled"
              to="#"
              onClick={prePage}
            >
              <i className="fa-solid fa-angle-left" />
            </Link>
            <span>
              {number.map((n, i) => (
                <Link
                  to={"#"}
                  className={`paginate_button ${currentPage === n ? "current" : ""
                    } `}
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
  );
};
