"use client";
import { useState, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function DataLists({
	subHeaderMemo = false,
	tableName = "",
	data = [],
	filterFields = [],
	style,
	className,
	columns,
	tableOptions,
}) {
	const [filterText, setFilterText] = useState("");

	// Filter items based on the filterFields provided and the filterText
	const filteredItems = data.filter((item) =>
		filterFields.some((field) =>
			item[field]?.toString().toLowerCase().includes(filterText.toLowerCase())
		)
	);

	const subHeaderComponentMemo = useMemo(() => {
		return (
			<div className="flex justify-between items-center mb-5 gap-3">
				<div className="text-xl font-bold">{tableName}</div>
				<input
					type="text"
					placeholder="Cari Disini..."
					value={filterText}
					onChange={(e) => setFilterText(e.target.value)}
				/>
			</div>
		);
	}, [filterText]);

	return (
		<>
			{subHeaderMemo && subHeaderComponentMemo}
			<DataTable
				value={filteredItems}
				style={style}
				className={className}
				tableStyle={{ minWidth: "50rem" }}
				{...tableOptions}
			>
				{columns.map((col, index) => (
					<Column
						key={index}
						field={col.field}
						body={col.body}
						header={col.header}
					/>
				))}
			</DataTable>
		</>
	);
}
