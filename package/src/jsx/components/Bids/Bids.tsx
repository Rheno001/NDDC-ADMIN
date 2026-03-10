import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import CreateBidModal, { CreateBidModalHandle } from "./CreateBidModal";
import ViewBidModal, { ViewBidModalHandle } from "./ViewBidModal";
import { TanStackTable } from "../Common/TanStackTable";
import { ColumnDef, Row, Table } from "@tanstack/react-table";

type BidStatus = "DRAFT" | "SUBMITTED_FOR_APPROVAL" | "APPROVED" | "REJECTED" | "PUBLISHED" | "CLOSED" | "CANCELLED";

interface BidRow {
    id: string;
    tenderReferenceNumber: string;
    title: string;
    description?: string;
    category?: string;
    department?: string;
    estimatedBudget?: number;
    submissionDeadline: string;
    status: BidStatus;
}

const statusBadge: Record<string, { badge: string; text: string }> = {
    "DRAFT": { badge: "badge-secondary", text: "Draft" },
    "Draft": { badge: "badge-secondary", text: "Draft" },
    "SUBMITTED_FOR_APPROVAL": { badge: "badge-info", text: "Submitted for Approval" },
    "APPROVED": { badge: "badge-success", text: "Approved" },
    "REJECTED": { badge: "badge-danger", text: "Rejected" },
    "PUBLISHED": { badge: "badge-primary", text: "Published" },
    "CLOSED": { badge: "badge-danger", text: "Closed" },
    "CANCELLED": { badge: "badge-light", text: "Cancelled" },
};

const Bids = () => {
    const modalRef = useRef<CreateBidModalHandle>(null);
    const viewModalRef = useRef<ViewBidModalHandle>(null);
    const [selectedBidForView, setSelectedBidForView] = useState<BidRow | undefined>(undefined);
    const [bids, setBids] = useState<BidRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Draft");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [pageIndex, setPageIndex] = useState(0);
    const PAGE_SIZE = 10;
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchBids = useCallback(async (refNum?: string, status?: string, page?: number) => {
        setIsLoading(true);
        try {
            let url = '/api/v1/bids?';
            const params = new URLSearchParams();

            const activeRef = refNum !== undefined ? refNum : searchTerm;
            const activeStatus = status !== undefined ? status : statusFilter;
            const activePage = page !== undefined ? page : pageIndex;

            if (activeRef) {
                params.append('tenderReferenceNumber', activeRef);
            }
            if (activeStatus && activeStatus !== "All Statuses" && activeStatus !== "All") {
                params.append('status', activeStatus.toUpperCase());
            }
            params.append('page', String(activePage));
            params.append('size', String(PAGE_SIZE));

            url += params.toString();
            console.log("FETCHING BIDS FROM URL:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bids');
            }

            const result = await response.json();
            console.log("FETCH BIDS RESULT RAW:", JSON.stringify(result, null, 2));

            let rawBids: any[] = [];
            let serverTotalElements = 0;
            let serverTotalPages = 0;

            if (result && typeof result === 'object') {
                // Spring-style paginated response: { data: { content: [], totalElements, totalPages } }
                if (result.data && Array.isArray(result.data.content)) {
                    rawBids = result.data.content;
                    serverTotalElements = result.data.totalElements ?? 0;
                    serverTotalPages = result.data.totalPages ?? 0;
                } else if (result.data && result.data.data && Array.isArray(result.data.data.content)) {
                    rawBids = result.data.data.content;
                    serverTotalElements = result.data.data.totalElements ?? 0;
                    serverTotalPages = result.data.data.totalPages ?? 0;
                } else if (Array.isArray(result.data)) {
                    rawBids = result.data;
                    serverTotalElements = result.totalElements ?? rawBids.length;
                    serverTotalPages = result.totalPages ?? 1;
                } else if (Array.isArray(result.content)) {
                    rawBids = result.content;
                    serverTotalElements = result.totalElements ?? rawBids.length;
                    serverTotalPages = result.totalPages ?? 1;
                } else if (Array.isArray(result)) {
                    rawBids = result;
                    serverTotalElements = rawBids.length;
                    serverTotalPages = 1;
                }
            }

            const fetchedBids: BidRow[] = rawBids.map((bid: any) => ({
                id: (bid.id || bid._id || '') as string,
                tenderReferenceNumber: (bid.tenderReferenceNumber || '') as string,
                title: (bid.title || '') as string,
                description: (bid.description || '') as string,
                category: (bid.category || '') as string,
                department: (bid.department || '') as string,
                estimatedBudget: (bid.estimatedBudget || bid.amount || 0) as number,
                submissionDeadline: (bid.submissionDeadline || bid.deadline || '') as string,
                status: (bid.status || 'DRAFT') as BidStatus
            }));

            setBids(fetchedBids);
            setTotalRows(serverTotalElements);
            setTotalPages(serverTotalPages);
            setSelectedIds(new Set());
        } catch (error) {
            console.error("Error fetching bids:", error);
            toast.error("Failed to load bids.");
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, statusFilter, pageIndex]);

    useEffect(() => {
        fetchBids();
    }, [fetchBids]);

    // When filters change, reset page to 0
    const handleFilterChange = (refNum: string, status: string) => {
        setPageIndex(0);
        fetchBids(refNum, status, 0);
    };

    const handlePageChange = (newPage: number) => {
        setPageIndex(newPage);
        fetchBids(searchTerm, statusFilter, newPage);
    };

    const handleLifecycleAction = useCallback(async (id: string, action: 'submit' | 'approve' | 'publish') => {
        try {
            let url = `/api/v1/bids/${id}/${action}`;
            if (action === 'approve') {
                const username = sessionStorage.getItem('username') || 'System Admin';
                url += `?approver=${encodeURIComponent(username)}`;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} bid`);
            }

            toast.success(`Bid ${action}ed successfully`);
            fetchBids();
        } catch (error) {
            console.error(`Error ${action}ing bid:`, error);
            toast.error(`Error: Could not ${action} bid.`);
        }
    }, [fetchBids]);

    const handleBulkAction = async (action: 'submit' | 'approve' | 'publish') => {
        const idsToProcess = Array.from(selectedIds);
        if (idsToProcess.length === 0) return;

        setIsLoading(true);
        let successCount = 0;
        let failCount = 0;

        for (const id of idsToProcess) {
            try {
                let url = `/api/v1/bids/${id}/${action}`;
                if (action === 'approve') {
                    const username = sessionStorage.getItem('username') || 'System Admin';
                    url += `?approver=${encodeURIComponent(username)}`;
                }

                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': import.meta.env.VITE_API_KEY || '',
                        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                    }
                });

                if (response.ok) successCount++;
                else failCount++;
            } catch {
                failCount++;
            }
        }

        toast.info(`Bulk ${action} complete: ${successCount} success, ${failCount} failed.`);
        fetchBids();
        setIsLoading(false);
    };

    const columns = useMemo<ColumnDef<BidRow>[]>(() => [
        {
            id: 'select',
            header: ({ table }: { table: Table<BidRow> }) => (
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
            cell: ({ row }: { row: Row<BidRow> }) => (
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
            ),
            enableSorting: false,
        },
        {
            header: "Bid Title",
            accessorKey: "title",
            cell: ({ row }: { row: Row<BidRow> }) => (
                <div className="trans-list">
                    <h6 className="mb-0 font-w600 text-primary">{row.original.title}</h6>
                </div>
            ),
        },
        {
            header: "Tender Ref",
            accessorKey: "tenderReferenceNumber",
            cell: ({ row }: { row: Row<BidRow> }) => (
                <span className="text-primary font-w600">{row.original.tenderReferenceNumber || row.original.id}</span>
            ),
        },
        {
            header: "Deadline",
            accessorKey: "submissionDeadline",
            cell: ({ row }: { row: Row<BidRow> }) => (
                <span className="font-w500">
                    {row.original.submissionDeadline ? new Date(row.original.submissionDeadline).toLocaleDateString() : "N/A"}
                </span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }: { row: Row<BidRow> }) => {
                const statusInfo = statusBadge[row.original.status] || { badge: "badge-secondary", text: row.original.status };
                return (
                    <span className={`badge badge-${statusInfo.badge.replace("badge-", "")} light`}>
                        {statusInfo.text}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-end">Action</div>,
            cell: ({ row }: { row: Row<BidRow> }) => {
                const item = row.original;
                return (
                    <div className="text-end">
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle className="i-false btn sharp tp-btn" as="div">
                                <svg width="24" height="6" viewBox="0 0 24 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0012 0.359985C11.6543 0.359985 11.3109 0.428302 10.9904 0.561035C10.67 0.693767 10.3788 0.888317 10.1335 1.13358C9.88829 1.37883 9.69374 1.67 9.56101 1.99044C9.42828 2.31089 9.35996 2.65434 9.35996 3.00119C9.35996 3.34803 9.42828 3.69148 9.56101 4.01193C9.69374 4.33237 9.88829 4.62354 10.1335 4.8688C10.3788 5.11405 10.67 5.3086 10.9904 5.44134C11.3109 5.57407 11.6543 5.64239 12.0012 5.64239C12.7017 5.64223 13.3734 5.36381 13.8686 4.86837C14.3638 4.37294 14.6419 3.70108 14.6418 3.00059C14.6416 2.3001 14.3632 1.62836 13.8677 1.13315C13.3723 0.637942 12.7004 0.359826 12 0.359985H12.0012ZM3.60116 0.359985C3.25431 0.359985 2.91086 0.428302 2.59042 0.561035C2.26997 0.693767 1.97881 0.888317 1.73355 1.13358C1.48829 1.37883 1.29374 1.67 1.16101 1.99044C1.02828 2.31089 0.959961 2.65434 0.959961 3.00119C0.959961 3.34803 1.02828 3.69148 1.16101 4.01193C1.29374 4.33237 1.48829 4.62354 1.73355 4.8688C1.97881 5.11405 2.26997 5.3086 2.59042 5.44134C2.91086 5.57407 3.25431 5.64239 3.60116 5.64239C4.30165 5.64223 4.97339 5.36381 5.4686 4.86837C5.9638 4.37294 6.24192 3.70108 6.24176 3.00059C6.2416 2.3001 5.96318 1.62836 5.46775 1.13315C4.97231 0.637942 4.30045 0.359826 3.59996 0.359985H3.60116ZM20.4012 0.359985C20.0543 0.359985 19.7109 0.428302 19.3904 0.561035C19.07 0.693767 18.7788 0.888317 18.5336 1.13358C18.2883 1.37883 18.0937 1.67 17.961 1.99044C17.8283 2.31089 17.76 2.65434 17.76 3.00119C17.76 3.34803 17.8283 3.69148 17.961 4.01193C18.0937 4.33237 18.2883 4.62354 18.5336 4.8688C18.7788 5.11405 19.07 5.3086 19.3904 5.44134C19.7109 5.57407 20.0543 5.64239 20.4012 5.64239C21.1017 5.64223 21.7734 5.36381 22.2686 4.86837C22.7638 4.37294 23.0419 3.70108 23.0418 3.00059C23.0416 2.3001 22.7632 1.62836 22.2677 1.13315C21.7723 0.637942 21.1005 0.359826 20.4 0.359985H20.4012Z" fill="#A098AE" />
                                </svg>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-end" align="end" renderOnMount>
                                <Dropdown.Item onClick={() => {
                                    setSelectedBidForView(item);
                                    viewModalRef.current?.show();
                                }}>
                                    View Details
                                </Dropdown.Item>
                                {item.status === 'DRAFT' && (
                                    <>
                                        <Dropdown.Item onClick={() => handleLifecycleAction(item.id, 'submit')}>
                                            Submit Bid
                                        </Dropdown.Item>
                                        <Dropdown.Item>Edit Bid</Dropdown.Item>
                                        <Dropdown.Item className="text-danger">Delete</Dropdown.Item>
                                    </>
                                )}
                                {item.status === 'SUBMITTED_FOR_APPROVAL' && (
                                    <Dropdown.Item onClick={() => handleLifecycleAction(item.id, 'approve')}>
                                        Approve Bid
                                    </Dropdown.Item>
                                )}
                                {item.status === 'APPROVED' && (
                                    <Dropdown.Item onClick={() => handleLifecycleAction(item.id, 'publish')}>
                                        Publish
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                );
            },
            enableSorting: false,
        }
    ], [handleLifecycleAction]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange(searchTerm, statusFilter);
    };

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row">
                        {/* Page header */}
                        <div className="col-xl-12">
                            <div className="page-title flex-wrap">
                                <form className="input-group search-area mb-md-0 mb-3" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by ID (e.g. TND-2026-000003)"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button className="input-group-text" type="submit">
                                        <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5605 15.4395L13.7527 11.6317C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6317 13.7527L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9747 18.1462 16.0252 17.5605 15.4395V15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5V7.5Z" fill="#01A3FF" />
                                        </svg>
                                    </button>
                                </form>
                                <div className="d-flex">
                                    <Dropdown
                                        className="drop-select me-3"
                                        onSelect={(v) => {
                                            const newStatus = v || "All Statuses";
                                            setStatusFilter(newStatus);
                                            handleFilterChange(searchTerm, newStatus);
                                        }}
                                    >
                                        <Dropdown.Toggle as="div" className="drop-select-btn">
                                            {statusFilter}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item eventKey="All Statuses">All</Dropdown.Item>
                                            <Dropdown.Item eventKey="DRAFT">Draft</Dropdown.Item>
                                            <Dropdown.Item eventKey="SUBMITTED_FOR_APPROVAL">Submitted for Approval</Dropdown.Item>
                                            <Dropdown.Item eventKey="APPROVED">Approved</Dropdown.Item>
                                            <Dropdown.Item eventKey="REJECTED">Rejected</Dropdown.Item>
                                            <Dropdown.Item eventKey="PUBLISHED">Published</Dropdown.Item>
                                            <Dropdown.Item eventKey="CLOSED">Closed</Dropdown.Item>
                                            <Dropdown.Item eventKey="CANCELLED">Cancelled</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={() => modalRef.current?.openModal()}
                                    >
                                        + New Bid
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <CreateBidModal
                            ref={modalRef}
                            onBidCreated={() => {
                                console.log("ON BID CREATED CALLED. Resetting filters to Draft specifically.");
                                setSearchTerm("");
                                setStatusFilter("Draft");
                                setPageIndex(0);
                                fetchBids("", "Draft", 0);
                            }}
                        />

                        <ViewBidModal
                            ref={viewModalRef}
                            bid={selectedBidForView}
                        />

                        {/* Table */}
                        <div className="col-xl-12 wow fadeInUp" data-wow-delay="1.5s">
                            <div className="table-responsive full-data">
                                <div id="example-bids_wrapper" className="dataTables_wrapper no-footer">
                                    {selectedIds.size > 0 && (
                                        <div className="d-flex align-items-center mb-3 p-2 bg-light rounded border">
                                            <span className="me-3 font-w600">{selectedIds.size} Bids Selected</span>
                                            <button
                                                className="btn btn-info btn-sm me-2"
                                                onClick={() => handleBulkAction('submit')}
                                                disabled={isLoading}
                                            >
                                                Bulk Submit
                                            </button>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => handleBulkAction('approve')}
                                                disabled={isLoading}
                                            >
                                                Bulk Approve
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleBulkAction('publish')}
                                                disabled={isLoading}
                                            >
                                                Bulk Publish
                                            </button>
                                        </div>
                                    )}
                                    {isLoading ? (
                                        <div className="text-center p-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <TanStackTable
                                            data={bids}
                                            columns={columns}
                                            onSelectionChange={setSelectedIds}
                                            enableSelection={true}
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
            </div>
        </>
    );
};

export default Bids;
