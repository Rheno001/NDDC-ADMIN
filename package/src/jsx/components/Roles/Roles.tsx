import { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef, Row } from "@tanstack/react-table";

interface RoleRow {
    id: string;
    name: string;
    description: string;
    permissionsCount: number;
}

const Roles = () => {
    const [roles, setRoles] = useState<RoleRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const PAGE_SIZE = 10;
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const fetchRoles = useCallback(async (page?: number) => {
        setIsLoading(true);
        try {
            const activePage = page !== undefined ? page : pageIndex;
            const url = `/api/v1/roles?page=${activePage}&size=${PAGE_SIZE}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY || "",
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch roles");

            const result = await response.json();

            // Handle all common nesting patterns and pagination metadata
            let rawRoles: any[] = [];
            let serverTotalElements = 0;
            let serverTotalPages = 0;

            if (result && typeof result === 'object') {
                if (result.data?.content && Array.isArray(result.data.content)) {
                    rawRoles = result.data.content;
                    serverTotalElements = result.data.totalElements ?? 0;
                    serverTotalPages = result.data.totalPages ?? 0;
                } else if (result.data?.data?.content && Array.isArray(result.data.data.content)) {
                    rawRoles = result.data.data.content;
                    serverTotalElements = result.data.data.totalElements ?? 0;
                    serverTotalPages = result.data.data.totalPages ?? 0;
                } else if (Array.isArray(result.data)) {
                    rawRoles = result.data;
                    serverTotalElements = result.totalElements ?? rawRoles.length;
                    serverTotalPages = result.totalPages ?? 1;
                } else if (Array.isArray(result)) {
                    rawRoles = result;
                    serverTotalElements = rawRoles.length;
                    serverTotalPages = 1;
                }
            }

            const fetchedRoles: RoleRow[] = rawRoles.map((r: any) => ({
                id: String(r.id || r._id || ""),
                name: r.name || "",
                description: r.description || "No description",
                permissionsCount: Array.isArray(r.permissions)
                    ? r.permissions.length
                    : 0,
            }));

            setRoles(fetchedRoles);
            setTotalRows(serverTotalElements);
            setTotalPages(serverTotalPages);
        } catch (error) {
            console.error("Error fetching roles:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load roles.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    }, [pageIndex]);

    const handlePageChange = (newPage: number) => {
        setPageIndex(newPage);
        fetchRoles(newPage);
    };

    const handleDeleteRole = useCallback(async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/api/v1/roles/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY || "",
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete role");

            Swal.fire({
                title: "Deleted!",
                text: "Role has been deleted.",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            fetchRoles();
        } catch (error) {
            console.error("Error deleting role:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete role.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        }
    }, [fetchRoles]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const columns = useMemo<ColumnDef<RoleRow>[]>(
        () => [
            {
                header: "Role Name",
                accessorKey: "name",
                cell: ({ row }: { row: Row<RoleRow> }) => (
                    <div className="trans-list">
                        <h4
                            className="mb-0 text-primary font-w600"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                navigate("/add-role", {
                                    state: { roleId: row.original.id },
                                })
                            }
                        >
                            {row.original.name}
                        </h4>
                    </div>
                ),
            },
            {
                header: "Description",
                accessorKey: "description",
                cell: ({ row }: { row: Row<RoleRow> }) => (
                    <span className="font-w500">{row.original.description}</span>
                ),
            },
            {
                header: "Permissions",
                accessorKey: "permissionsCount",
                cell: ({ row }: { row: Row<RoleRow> }) => (
                    <span className="badge badge-info light">
                        {row.original.permissionsCount} Permission
                        {row.original.permissionsCount !== 1 ? "s" : ""}
                    </span>
                ),
            },
            {
                header: "Action",
                cell: ({ row }: { row: Row<RoleRow> }) => (
                    <div className="d-flex">
                        <button
                            onClick={() =>
                                navigate("/add-role", {
                                    state: { roleId: row.original.id },
                                })
                            }
                            className="btn btn-primary shadow btn-xs sharp me-1"
                            title="Edit Role"
                        >
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button
                            onClick={() => handleDeleteRole(row.original.id)}
                            className="btn btn-danger shadow btn-xs sharp"
                            title="Delete Role"
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
                ),
            },
        ],
        [navigate, handleDeleteRole]
    );

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header flex-wrap border-0 pb-0">
                        <div>
                            <h4 className="heading mb-0">Role Management</h4>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="input-group search-area mb-md-0 mb-3 me-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search roles..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                                <span className="input-group-text">
                                    <i className="fa fa-search text-primary"></i>
                                </span>
                            </div>
                            <Link to="/add-role" className="btn btn-primary d-block">
                                + New Role
                            </Link>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <div id="example-roles_wrapper" className="dataTables_wrapper no-footer">
                            {isLoading ? (
                                <div className="text-center p-5">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading roles...
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <TanStackTable
                                    data={roles}
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

export default Roles;