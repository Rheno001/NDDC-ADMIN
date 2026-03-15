import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef } from "@tanstack/react-table";

interface DocumentRow {
    id: string;
    name: string;
    status: string;
    dateUploaded: string;
}

const VendorDocuments = () => {
    const { id } = useParams<{ id: string }>();
    const [globalFilter, setGlobalFilter] = useState("");

    const dummyDocuments: DocumentRow[] = [
        { id: "1", name: "Certificate of Incorporation", status: "Verified", dateUploaded: "2023-10-12" },
        { id: "2", name: "Tax Clearance Certificate", status: "Verified", dateUploaded: "2023-11-05" },
        { id: "3", name: "VAT Registration", status: "Pending", dateUploaded: "2023-12-01" },
        { id: "4", name: "Bank Reference", status: "Verified", dateUploaded: "2023-09-20" },
        { id: "5", name: "Company Profile", status: "Verified", dateUploaded: "2023-10-15" },
    ];

    const columns = useMemo<ColumnDef<DocumentRow>[]>(
        () => [
            {
                header: "Document Name",
                accessorKey: "name",
                cell: ({ row }) => <span className="font-w500 text-black">{row.original.name}</span>,
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => (
                    <span className={`badge badge-${row.original.status === 'Verified' ? 'success' : 'warning'} light`}>
                        {row.original.status}
                    </span>
                ),
            },
            {
                header: "Date Uploaded",
                accessorKey: "dateUploaded",
                cell: ({ row }) => <span className="font-w500">{row.original.dateUploaded}</span>,
            },
            {
                id: "actions",
                header: () => <div className="text-end">Action</div>,
                cell: () => (
                    <div className="text-end">
                        <button className="btn btn-primary btn-xxs shadow">View File</button>
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
                            placeholder="Search documents..."
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
                        <h4 className="card-title">Vendor Documents - {id?.slice(-6).toUpperCase()}</h4>
                    </div>
                    <div className="card-body p-0">
                        <TanStackTable
                            data={dummyDocuments}
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

export default VendorDocuments;
