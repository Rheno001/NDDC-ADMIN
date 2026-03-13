import { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef, Row, Table } from "@tanstack/react-table";

interface VendorRow {
  id: string;
  companyName: string;
  rcNumber: string;
  tinNumber: string;
  email: string;
  phoneNumber: string;
  status: string;
}

const Vendors = () => {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/vendors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY || "",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const result = await response.json();

      let rawVendors: any[] = [];
      if (result && typeof result === "object") {
        if (result.data && Array.isArray(result.data.content)) {
          rawVendors = result.data.content;
        } else if (Array.isArray(result.data)) {
          rawVendors = result.data;
        } else if (Array.isArray(result.content)) {
          rawVendors = result.content;
        } else if (Array.isArray(result)) {
          rawVendors = result;
        }
      }

      const fetchedVendors: VendorRow[] = rawVendors.map((v: any) => ({
        id: v.id || v._id || "",
        companyName: v.companyName || "",
        rcNumber: v.rcNumber || "",
        tinNumber: v.tinNumber || "",
        email: v.email || "",
        phoneNumber: v.phoneNumber || "",
        status: v.status || "ACTIVE",
      }));

      setVendors(fetchedVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const statusBadge: Record<string, string> = {
    ACTIVE: "badge-success",
    INACTIVE: "badge-secondary",
    SUSPENDED: "badge-warning",
    BLACKLISTED: "badge-danger",
    PENDING: "badge-info",
    DRAFT: "badge-secondary",
  };

  const columns = useMemo<ColumnDef<VendorRow>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: Table<VendorRow> }) => (
          <div className="form-check custom-checkbox checkbox-primary">
            <input
              type="checkbox"
              className="form-check-input"
              id="checkAll"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
            <label className="form-check-label" htmlFor="checkAll"></label>
          </div>
        ),
        cell: ({ row }: { row: Row<VendorRow> }) => (
          <div className="form-check custom-checkbox checkbox-primary">
            <input
              type="checkbox"
              className="form-check-input"
              id={`check-${row.original.id}`}
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
            <label className="form-check-label" htmlFor={`check-${row.original.id}`}></label>
          </div>
        )
      },
      {
        header: "Company Name",
        accessorKey: "companyName",
        cell: ({ row }: { row: Row<VendorRow> }) => (
          <div className="trans-list">
            <h4 className="mb-0">
              <Link to="/vendor-details" state={{ vendorId: row.original.id }} className="text-primary">
                {row.original.companyName}
              </Link>
            </h4>
          </div>
        ),
      },
      {
        header: "TIN Number",
        accessorKey: "tinNumber",
        cell: ({ row }: { row: Row<VendorRow> }) => (
          <span className="text-primary font-w600">{row.original.tinNumber}</span>
        ),
      },
      {
        header: "RC Number",
        accessorKey: "rcNumber",
        cell: ({ row }: { row: Row<VendorRow> }) => (
          <span className="font-w500">{row.original.rcNumber}</span>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }: { row: Row<VendorRow> }) => (
          <span className="font-w500">{row.original.email}</span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: { row: Row<VendorRow> }) => {
          const badge = statusBadge[row.original.status] || "badge-secondary";
          return (
            <span className={`badge ${badge} light`}>{row.original.status}</span>
          );
        },
      },
    ],
    []
  );

  const selectedVendorId = selectedIds.size === 1 ? Array.from(selectedIds)[0] : null;

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="row">
            <div className="col-xl-12">
              <div className="page-title flex-wrap">
                <div className="input-group search-area mb-md-0 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search vendors..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                  <span className="input-group-text">
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5605 15.4395L13.7527 11.6317C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6317 13.7527L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9747 18.1462 16.0252 17.5605 15.4395V15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5V7.5Z" fill="#01A3FF" />
                    </svg>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  {selectedIds.size > 0 && (
                    <div className="me-3">
                      {selectedVendorId && (
                        <Link
                          to="/vendor-details"
                          state={{ vendorId: selectedVendorId }}
                          className="btn btn-info btn-sm me-2"
                        >
                          View Details
                        </Link>
                      )}
                      <span className="text-muted font-w500">{selectedIds.size} Selected</span>
                    </div>
                  )}
                  <Link to="/add-vendor" className="btn btn-primary">
                    + New Vendor
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-xl-12 wow fadeInUp" data-wow-delay="1.5s">
              <div className="table-responsive full-data">
                <div id="example-vendor_wrapper" className="dataTables_wrapper no-footer">
                  {isLoading ? (
                    <div className="text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <TanStackTable
                      data={vendors}
                      columns={columns}
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                      onSelectionChange={setSelectedIds}
                      enableSelection={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vendors;