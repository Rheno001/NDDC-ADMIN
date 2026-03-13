import { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef, Row } from "@tanstack/react-table";

interface PermissionRow {
    id: string;
    name: string;
    label: string;
    description: string;
    group: string[];
    groupType: string;
}

const Permissions = () => {
    const [permissions, setPermissions] = useState<PermissionRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const PAGE_SIZE = 10;
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchPermissions = useCallback(async (page?: number) => {
        setIsLoading(true);
        try {
            const activePage = page !== undefined ? page : pageIndex;
            const response = await fetch(`/api/v1/permissions?page=${activePage}&size=1000&groupType=ALL&search=${globalFilter}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY || "",
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch permissions");
            }

            const result = await response.json();

            // Handle all common nesting patterns and pagination metadata
            let raw: any[] = [];
            let serverTotalElements = 0;
            let serverTotalPages = 0;

            if (result && typeof result === 'object') {
                if (result.data?.content && Array.isArray(result.data.content)) {
                    raw = result.data.content;
                    serverTotalElements = result.data.totalElements ?? 0;
                    serverTotalPages = result.data.totalPages ?? 0;
                } else if (result.data?.data?.content && Array.isArray(result.data.data.content)) {
                    raw = result.data.data.content;
                    serverTotalElements = result.data.data.totalElements ?? 0;
                    serverTotalPages = result.data.data.totalPages ?? 0;
                } else if (Array.isArray(result.data)) {
                    raw = result.data;
                    serverTotalElements = result.totalElements ?? raw.length;
                    serverTotalPages = result.totalPages ?? 1;
                } else if (Array.isArray(result)) {
                    raw = result;
                    serverTotalElements = raw.length;
                    serverTotalPages = 1;
                }
            }

            const fetchedPermissions: PermissionRow[] = raw.map((p: any) => ({
                id: String(p.id || p._id || ""),
                name: p.name || "",
                label: p.label || p.name || "",
                description: p.description || "No description",
                group: Array.isArray(p.group) ? p.group : [],
                groupType: p.groupType || "N/A",
            }));

            setPermissions(fetchedPermissions);
            setTotalRows(serverTotalElements);
            setTotalPages(serverTotalPages);
        } catch (error) {
            console.error("Error fetching permissions:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load permissions.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    }, [pageIndex]);

    const handlePageChange = (newPage: number) => {
        setPageIndex(newPage);
        fetchPermissions(newPage);
    };

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const columns = useMemo<ColumnDef<PermissionRow>[]>(
        () => [
            {
                header: "Label / Name",
                accessorKey: "label",
                cell: ({ row }: { row: Row<PermissionRow> }) => (
                    <div>
                        <h4 className="mb-0 text-primary font-w600">
                            {row.original.label}
                        </h4>
                        <small className="text-muted">{row.original.name}</small>
                    </div>
                ),
            },
            {
                header: "Description",
                accessorKey: "description",
                cell: ({ row }: { row: Row<PermissionRow> }) => (
                    <span className="font-w500">{row.original.description}</span>
                ),
            },
        ],
        []
    );

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header flex-wrap border-0 pb-0">
                        <div>
                            <h4 className="heading mb-0">Permission Management</h4>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="input-group search-area mb-md-0 mb-3 me-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search permissions..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                                <span className="input-group-text">
                                    <i className="fa fa-search text-primary"></i>
                                </span>
                            </div>
                            <Link to="/add-permission" className="btn btn-primary d-block">
                                + New Permission
                            </Link>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <div id="example-permissions_wrapper" className="dataTables_wrapper no-footer">
                            {isLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading permissions...</span>
                                    </div>
                                </div>
                            ) : (
                                <TanStackTable
                                    data={permissions}
                                    columns={columns}
                                    globalFilter={globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                    manualPagination={true}
                                    pageCount={totalPages}
                                    totalRows={totalRows}
                                    pageIndex={pageIndex}
                                    pageSize={PAGE_SIZE}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permissions;
