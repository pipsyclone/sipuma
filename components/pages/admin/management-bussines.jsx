"use client";
import { getBusiness } from "@/utils/custom-swr";
import DataLists from "@/components/ui/datatable";
import Card from "@/components/ui/card";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import Image from "next/image";
import axios from "axios";
import Scripts from "@/utils/scripts";
import { mutate } from "swr";

export default function ManagementBussines() {
	const { toastAlert } = Scripts();
	const { business } = getBusiness();
	const [modal, setModal] = useState(false);
	const [selectedData, setSelectedData] = useState(false);

	const rowStyle = (data) => {
		return {
			"text-green-500": data.bussines_status === "VERIFIED",
			"text-red-500": data.bussines_status === "NOT_VERIFIED",
		};
	};

	const handleDetail = (data) => {
		setSelectedData(data);
		setModal(true);
	};

	const handleUpdateStatus = async (umkmid, status) => {
		await axios
			.put("/api/bussines/update-status?umkmid=" + umkmid, { status })
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", res.data.title, res.data.message, 5000);
				} else {
					toastAlert("error", res.data.title, res.data.message, 5000);
				}
				// Mutate the cache to re-fetch or remove the deleted item manually
				mutate("/api/bussines/get-bussines");
			});
	};

	return (
		<Card className="mt-3 basis-1/2">
			<DataLists
				data={business}
				subHeaderMemo={true}
				tableName="Manajemen Pelaku Usaha"
				tableOptions={{
					paginator: true,
					rows: 5,
					rowsPerPageOptions: [5, 10, 50, 100],
					rowClassName: rowStyle,
				}}
				filterFields={["bussines_name"]}
				columns={[
					{ field: "bussines_name", header: "Nama Usaha" },
					{ field: "bussines_desc", header: "Deskripsi" },
					{ field: "bussines_status", header: "Status" },
					{
						field: "actions",
						header: "Aksi",
						body: (rowData) => (
							<div className="flex gap-3">
								<button
									type="button"
									className={`bg-sky-500 p-2 text-white rounded-lg hover:bg-sky-400`}
									onClick={() => handleDetail(rowData)}
								>
									LIHAT
								</button>
								{rowData.userid ? (
									rowData.bussines_status === "VERIFIED" ||
										rowData.bussines_status === "NOT_VERIFIED" ? (
										""
									) : (
										<div className="flex gap-3">
											<button
												type="button"
												onClick={() =>
													handleUpdateStatus(rowData.umkmid, "VERIFIED")
												}
												className={`bg-green-500 p-2 text-white rounded-lg hover:bg-green-400`}
											>
												SETUJUI
											</button>
											<button
												type="button"
												onClick={() =>
													handleUpdateStatus(rowData.umkmid, "NOT_VERIFIED")
												}
												className={`bg-red-500 p-2 text-white rounded-lg hover:bg-red-400`}
											>
												TOLAK
											</button>
										</div>
									)
								) : (
									""
								)}

								{modal && selectedData && (
									<Modal
										modal={modal}
										onClose={() => setModal(false)}
										title={"Detail Usaha Yang Diajukan"}
									>
										<Image
											src={"/foto-umkm/" + selectedData.bussines_foto}
											alt={selectedData.owner_name}
											width={1000}
											height={1000}
											className="w-auto h-[200px] mb-5 mx-auto"
										/>
										<pre>
											Nama Pemilik Usaha : {selectedData.owner_name}
											<br />
											Nama Usaha : {selectedData.bussines_name}
											<br />
											Kategori Usaha : {selectedData.category.category_name}
											<br />
											<br />
											Deskripsi :
											<br />
											{selectedData?.bussines_desc}
											<br />
											Alamat : {selectedData?.bussines_address}
											<br />
											<br />
											Bukti Pendirian Usaha :
											<br />
											{
												selectedData.bussines_proof_foto !== "-" ?
													<Image
														src={"/foto-bukti-pendirian-usaha/" + selectedData.bussines_proof_foto}
														alt={selectedData.owner_name}
														width={1000}
														height={1000}
														className="w-auto h-[200px] mb-5 mx-auto"
													/>
													: "-"
											}
										</pre>
									</Modal>
								)}
							</div>
						),
					},
				]}
			/>
		</Card>
	);
}
