import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef } from "@tanstack/react-table";

interface BidRow {
    id: string;
    tenderRef: string;
    projectTitle: string;
    status: string;
    dateSubmitted: string;
}

const VendorBids = () => {
    const { id } = useParams<{ id: string }>();
    const [globalFilter, setGlobalFilter] = useState("");

    const dummyBids: BidRow[] = [
        { id: "1", tenderRef: "TND-001", projectTitle: "IT Infrastructure Supply", status: "Submitted", dateSubmitted: "2023-10-12" },
        { id: "2", tenderRef: "TND-042", projectTitle: "Solar Panel Installation", status: "Won", dateSubmitted: "2023-11-05" },
        { id: "3", tenderRef: "TND-088", projectTitle: "Office Stationery Provision", status: "Lost", dateSubmitted: "2023-12-01" },
    ];

    const columns = useMemo<ColumnDef<BidRow>[]>(
        () => [
            {
                header: "Tender Ref",
                accessorKey: "tenderRef",
                cell: ({ row }) => <span className="font-w500 text-black">{row.original.tenderRef}</span>,
            },
            {
                header: "Project Title",
                accessorKey: "projectTitle",
                cell: ({ row }) => <span className="font-w500">{row.original.projectTitle}</span>,
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    let badgeClass = "secondary";
                    if (status === "Won") badgeClass = "success";
                    if (status === "Submitted") badgeClass = "info";
                    if (status === "Lost") badgeClass = "danger";
                    return <span className={`badge badge-${badgeClass} light`}>{status}</span>;
                },
            },
            {
                header: "Date Submitted",
                accessorKey: "dateSubmitted",
                cell: ({ row }) => <span className="font-w500">{row.original.dateSubmitted}</span>,
            },
            {
                id: "actions",
                header: () => <div className="text-end">Action</div>,
                cell: ({ row }) => (
                    <div className="text-end">
                        <Link to={`/bid-details/${row.original.id}`} className="btn btn-primary btn-xxs shadow">View Details</Link>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title flex-wrap">
                    <div className="input-group search-area mb-md-0 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search bids..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <Link to="/vendors" className="btn btn-primary light">
                        Back to Vendors
                    </Link>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Vendor Bid History - {id?.slice(-6).toUpperCase()}</h4>
                    </div>
                    <div className="card-body p-0">
                        <TanStackTable
                            data={dummyBids}
                            columns={columns}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorBids;
