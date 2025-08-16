import React, { useMemo, useState, useEffect } from "react";
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const Leaderboard = ({
	data = [],
	pageCount = 0,
	pagination,
	sorting,
	setPagination,
	setSorting,
	loading = false,
	handleVoteButton,
	handleViewVideoButton,
	user,
}) => {
	const [expandedRow, setExpandedRow] = useState(null);
	const [isMobile, setIsMobile] = useState(false);

	// Detect screen size
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const columns = useMemo(() => {
		const baseColumns = [
			columnHelper.display({
				id: "srExpander",
				header: "Sr.No",
				cell: ({ row }) => (
					<div className="d-flex align-items-center gap-2">
						{isMobile && (
							<button
								className="btn btn-sm btn-primary me-2"
								onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}>
								{expandedRow === row.id ? "−" : "+"}
							</button>
						)}
						<strong>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</strong>
					</div>
				),
				meta: { priority: 1 },
			}),
			columnHelper.accessor("userName", {
				header: "User",
				meta: { priority: 1 },
			}),
			columnHelper.accessor("title", {
				header: "Title",
				meta: { priority: 2 },
			}),
			columnHelper.accessor("uploadTime", {
				header: "Uploaded At",
				cell: (info) => new Date(info.getValue()).toLocaleString(),
				meta: { priority: 3 },
			}),
			columnHelper.accessor("totalVotes", {
				header: "Votes",
				meta: { priority: 2 },
			}),
			columnHelper.display({
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<div className="d-flex gap-2">
						{row.original.userId !== user.id && (
							<button
								className="btn btn-sm btn-success"
								onClick={() => handleVoteButton(row.original.id)}>
								👍 Vote
							</button>
						)}
						<button className="btn btn-sm btn-primary" onClick={() => handleViewVideoButton(row.original)}>
							View Video
						</button>
					</div>
				),
				meta: { priority: 2 },
			}),
		];

		return isMobile ? baseColumns.filter((col) => col.meta?.priority === 1) : baseColumns;
	}, [
		expandedRow,
		isMobile,
		pagination.pageIndex,
		pagination.pageSize,
		handleViewVideoButton,
		handleVoteButton,
		user,
	]);

	const table = useReactTable({
		data,
		columns,
		pageCount,
		state: {
			sorting,
			pagination,
		},
		manualPagination: true,
		manualSorting: true,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
	});

	const getHiddenColumns = (row) => {
		if (!isMobile) return [];
		return [
			{ key: "title", header: "Title", value: row.original.title },
			{
				key: "uploadTime",
				header: "Uploaded At",
				value: new Date(row.original.uploadTime).toLocaleString(),
			},
			{ key: "totalVotes", header: "Votes", value: row.original.totalVotes },
			{
				key: "actions",
				header: "Actions",
				value: (
					<div className="d-flex gap-2">
						{row.original.userId !== user.id && (
							<button
								className="btn btn-sm btn-success"
								onClick={() => handleVoteButton(row.original.id)}>
								👍 Vote
							</button>
						)}
						<button className="btn btn-sm btn-primary" onClick={() => handleViewVideoButton(row.original)}>
							View Video
						</button>
					</div>
				),
			},
		];
	};

	return (
		<div>
			<div className="table-responsive">
				<table className="table table-hover table-bordered align-middle">
					<thead className="table-primary">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const isSortable = header.column.getCanSort?.();
									return (
										<th
											key={header.id}
											onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
											style={{
												cursor: isSortable ? "pointer" : "default",
											}}>
											{flexRender(header.column.columnDef.header, header.getContext())}
											{header.column.getIsSorted() === "asc" ? " 🔼" : ""}
											{header.column.getIsSorted() === "desc" ? " 🔽" : ""}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={columns.length} className="text-center">
									Loading...
								</td>
							</tr>
						) : data.length ? (
							table.getRowModel().rows.map((row) => (
								<React.Fragment key={row.id}>
									<tr>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										))}
									</tr>
									{isMobile && expandedRow === row.id && (
										<tr className="table-light">
											<td colSpan={row.getVisibleCells().length}>
												<div>
													<strong className="d-block mb-2">Details:</strong>
													{getHiddenColumns(row).map((col) => (
														<div
															key={col.key}
															className="d-flex flex-column py-1 border-bottom">
															<span className="fw-normal">{col.header}:</span>
															<strong>{col.value}</strong>
														</div>
													))}
												</div>
											</td>
										</tr>
									)}
								</React.Fragment>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className="text-center">
									No Videos Uploaded!
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="container-fluid mt-3">
				<div className="row g-2 align-items-center">
					{/* Navigation Buttons */}
					<div className="col-12 col-sm-4 d-flex flex-wrap justify-content-center gap-2">
						<button
							className="btn btn-sm btn-outline-primary px-3"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}>
							⏮ First
						</button>
						<button
							className="btn btn-sm btn-outline-primary px-3"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							◀ Prev
						</button>
						<button
							className="btn btn-sm btn-outline-primary px-3"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							Next ▶
						</button>
						<button
							className="btn btn-sm btn-outline-primary px-3"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}>
							Last ⏭
						</button>
					</div>

					{/* Page Info */}
					<div className="col-12 col-sm-4 text-center">
						<span className="fw-semibold">
							Page {pageCount > 0 ? pagination.pageIndex + 1 : 0} of {pageCount}
						</span>
					</div>

					{/* Page Size Selector */}
					<div className="col-12 col-sm-4 text-sm-end text-center">
						<select
							className="form-select form-select-sm w-auto d-inline-block"
							value={pagination.pageSize}
							onChange={(e) => table.setPageSize(Number(e.target.value))}>
							{[5, 10, 20, 50].map((size) => (
								<option key={size} value={size}>
									Show {size}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
