import { useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { TanStackTable } from "../../Common/TanStackTable";
import { ColumnDef, Row } from "@tanstack/react-table";

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
  const columns = useMemo<ColumnDef<tableDataType>[]>(() => [
    {
      header: "Company Name",
      accessorKey: "companyName",
      cell: ({ row }: { row: Row<tableDataType> }) => (
        <div className="trans-list d-flex align-items-center">
          <div
            className="avatar avatar-sm me-3 bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ borderRadius: "50%", fontSize: "0.75rem", minWidth: 36, height: 36 }}
          >
            {row.original.initials}
          </div>
          <span style={{ fontWeight: 400 }}>{row.original.companyName}</span>
        </div>
      ),
    },
    {
      header: "RC Number",
      accessorKey: "rcNumber",
      cell: ({ row }: { row: Row<tableDataType> }) => (
        <span className="text-primary">{row.original.rcNumber}</span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }: { row: Row<tableDataType> }) => (
        <span className="text-primary">{row.original.category}</span>
      ),
    },
    {
      header: "Registration",
      accessorKey: "registration",
      cell: ({ row }: { row: Row<tableDataType> }) => (
        <span className="px-2">{row.original.registration}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: Row<tableDataType> }) => (
        <span className="badge badge-success light">{row.original.status}</span>
      ),
    },
    {
      header: "Action",
      id: "actions",
      cell: () => (
        <Dropdown className="custom-dropdown">
          <Dropdown.Toggle as="div" className="btn sharp tp-btn i-false">
            <svg width="18" height="6" viewBox="0 0 24 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.0012 0.359985C11.6543 0.359985 11.3109 0.428302 10.9904 0.561035C10.67 0.693767 10.3788 0.888317 10.1335 1.13358C9.88829 1.37883 9.69374 1.67 9.56101 1.99044C9.42828 2.31089 9.35996 2.65434 9.35996 3.00119C9.35996 3.34803 9.42828 3.69148 9.56101 4.01193C9.69374 4.33237 9.88829 4.62354 10.1335 4.8688C10.3788 5.11405 10.67 5.3086 10.9904 5.44134C11.3109 5.57407 11.6543 5.64239 12.0012 5.64239C12.7017 5.64223 13.3734 5.36381 13.8686 4.86837C14.3638 4.37294 14.6419 3.70108 14.6418 3.00059C14.6416 2.3001 14.3632 1.62836 13.8677 1.13315C13.3723 0.637942 12.7004 0.359826 12 0.359985H12.0012ZM3.60116 0.359985C3.25431 0.359985 2.91086 0.428302 2.59042 0.561035C2.26997 0.693767 1.97881 0.888317 1.73355 1.13358C1.48829 1.37883 1.29374 1.67 1.16101 1.99044C1.02828 2.31089 0.959961 2.65434 0.959961 3.00119C0.959961 3.34803 1.02828 3.69148 1.16101 4.01193C1.29374 4.33237 1.48829 4.62354 1.73355 4.8688C1.97881 5.11405 2.26997 5.3086 2.59042 5.44134C2.91086 5.57407 3.25431 5.64239 3.60116 5.64239C4.30165 5.64223 4.97339 5.36381 5.4686 4.86837C5.9638 4.37294 6.24192 3.70108 6.24176 3.00059C6.2416 2.3001 5.96318 1.62836 5.46775 1.13315C4.97231 0.637942 4.30045 0.359826 3.59996 0.359985H3.60116ZM20.4012 0.359985C20.0543 0.359985 19.7109 0.428302 19.3904 0.561035C19.07 0.693767 18.7788 0.888317 18.5336 1.13358C18.2883 1.37883 18.0937 1.67 17.961 1.99044C17.8283 2.31089 17.76 2.65434 17.76 3.00119C17.76 3.34803 17.8283 3.69148 17.961 4.01193C18.0937 4.33237 18.2883 4.62354 18.5336 4.8688C18.7788 5.11405 19.07 5.3086 19.3904 5.44134C19.7109 5.57407 20.0543 5.64239 20.4012 5.64239C21.1017 5.64223 21.7734 5.36381 22.2686 4.86837C22.7638 4.37294 23.0419 3.70108 23.0418 3.00059C23.0416 2.3001 22.7632 1.62836 22.2677 1.13315C21.7723 0.637942 21.1005 0.359826 20.4 0.359985H20.4012Z" fill="#A098AE" />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end" align="end" renderOnMount>
            <Dropdown.Item>Draft</Dropdown.Item>
            <Dropdown.Item>Invited</Dropdown.Item>
            <Dropdown.Item>Pending Activation</Dropdown.Item>
            <Dropdown.Item>Active</Dropdown.Item>
            <Dropdown.Item>Suspended</Dropdown.Item>
            <Dropdown.Item>Blacklisted</Dropdown.Item>
            <Dropdown.Item>Archived</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    }
  ], []);

  return (
    <div className="table-responsive basic-tbl">
      <div id="teacher-table_wrapper" className="dataTables_wrapper no-footer">
        <TanStackTable
          data={tableData}
          columns={columns}
          enableSelection={false}
        />
      </div>
    </div>
  );
};
