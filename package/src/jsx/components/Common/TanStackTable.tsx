import { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface TanStackTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[];
    onSelectionChange?: (selectedIds: Set<string>) => void;
    globalFilter?: string;
    setGlobalFilter?: (filter: string) => void;
    enableSelection?: boolean;
    // Server-side pagination props (optional)
    manualPagination?: boolean;
    pageCount?: number;          // total pages from server
    totalRows?: number;          // total row count from server
    pageIndex?: number;          // controlled (0-based)
    pageSize?: number;           // controlled
    onPageChange?: (pageIndex: number) => void;
}

export function TanStackTable<T extends { id: string }>({
    data,
    columns,
    onSelectionChange,
    globalFilter: externalGlobalFilter,
    setGlobalFilter: setExternalGlobalFilter,
    enableSelection = false,
    manualPagination = false,
    pageCount: serverPageCount,
    totalRows,
    pageIndex: externalPageIndex,
    pageSize: externalPageSize = 10,
    onPageChange,
}: TanStackTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    // Internal pagination state (used only when manualPagination=false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: externalPageSize,
    });

    // Resolve which pagination values to use
    const resolvedPageIndex = manualPagination ? (externalPageIndex ?? 0) : pagination.pageIndex;
    const resolvedPageSize = manualPagination ? externalPageSize : pagination.pageSize;

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            rowSelection,
            globalFilter: externalGlobalFilter !== undefined ? externalGlobalFilter : globalFilter,
            pagination: {
                pageIndex: resolvedPageIndex,
                pageSize: resolvedPageSize,
            },
        },
        // Manual pagination wiring
        manualPagination,
        pageCount: manualPagination ? (serverPageCount ?? -1) : undefined,
        onPaginationChange: manualPagination
            ? (updater) => {
                const next = typeof updater === "function"
                    ? updater({ pageIndex: resolvedPageIndex, pageSize: resolvedPageSize })
                    : updater;
                if (onPageChange) onPageChange(next.pageIndex);
            }
            : setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setExternalGlobalFilter || setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: enableSelection,
        getRowId: (row) => row.id,
    });

    // Notify parent of selection changes
    useEffect(() => {
        if (onSelectionChange) {
            const selectedIds = new Set(
                Object.keys(rowSelection).filter((id) => (rowSelection as Record<string, boolean>)[id])
            );
            onSelectionChange(selectedIds);
        }
    }, [rowSelection, onSelectionChange]);

    const currentPageIndex = resolvedPageIndex;
    const currentPageSize = resolvedPageSize;

    // For display: prefer server totalRows, fall back to client filtered count
    const displayTotal = manualPagination
        ? (totalRows ?? 0)
        : table.getFilteredRowModel().rows.length;

    const displayFrom = data.length > 0 ? currentPageIndex * currentPageSize + 1 : 0;
    const displayTo = Math.min((currentPageIndex + 1) * currentPageSize, displayTotal);

    // Page options for numbered buttons
    const totalPages = manualPagination
        ? (serverPageCount ?? 0)
        : table.getPageOptions().length;

    const canPrev = currentPageIndex > 0;
    const canNext = manualPagination
        ? currentPageIndex < totalPages - 1
        : table.getCanNextPage();

    const goTo = (idx: number) => {
        if (manualPagination) {
            onPageChange?.(idx);
        } else {
            table.setPageIndex(idx);
        }
    };

    return (
        <div className="table-responsive full-data">
            <table className="table-responsive-lg table display dataTablesCard vendor-tab dataTable no-footer">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    style={{
                                        cursor: header.column.getCanSort() ? "pointer" : "default",
                                        fontSize: "1rem",
                                        fontWeight: 700
                                    }}
                                    className={header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? "sorting_asc" : "sorting_desc") : ""}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center">
                                No data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                <div className="dataTables_info">
                    Showing {displayFrom} to {displayTo} of {displayTotal} entries
                </div>
                <div className="dataTables_paginate paging_simple_numbers justify-content-center">
                    <Link
                        className={`paginate_button previous ${!canPrev ? "disabled" : ""}`}
                        to="#"
                        onClick={(e) => { e.preventDefault(); if (canPrev) goTo(currentPageIndex - 1); }}
                    >
                        <i className="fa-solid fa-angle-left" />
                    </Link>
                    <span>
                        {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
                            <Link
                                key={pageNumber}
                                to="#"
                                className={`paginate_button ${currentPageIndex === pageNumber ? "current" : ""}`}
                                onClick={(e) => { e.preventDefault(); goTo(pageNumber); }}
                            >
                                {pageNumber + 1}
                            </Link>
                        ))}
                    </span>
                    <Link
                        className={`paginate_button next ${!canNext ? "disabled" : ""}`}
                        to="#"
                        onClick={(e) => { e.preventDefault(); if (canNext) goTo(currentPageIndex + 1); }}
                    >
                        <i className="fa-solid fa-angle-right" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
