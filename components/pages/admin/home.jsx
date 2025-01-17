"use client";
import Card from "@/components/ui/card";
import CardMonitoring from "@/components/ui/card-monitoring";
import Charts from "@/components/ui/charts";
import DataLists from "@/components/ui/datatable";
import {
	getBusiness,
	getBusinessByUser,
	getEvents,
	getUsers,
} from "@/utils/custom-swr";
import Scripts from "@/utils/scripts";
import { useSession } from "next-auth/react";
import axios from "axios";
import { mutate } from "swr";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import Image from "next/image";

export default function IndexDashboard() {
	const { data: session } = useSession();
	const { toastAlert } = Scripts();
	const { users } = getUsers();
	const { business, verified, notVerified, waitVerified } = getBusiness();
	const { businessByUser } = getBusinessByUser(session?.user?.userid);
	const { events } = getEvents();
	const [modal, setModal] = useState(false);
	const [selectedData, setSelectedData] = useState(false);

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
		<>
			{session?.user?.role === "ADMIN" ? (
				<>
					<div className="flex flex-col md:flex-row gap-3">
						<CardMonitoring
							className="border-blue-500 basis-1/2"
							title={"Jumlah Pengguna"}
							content={users?.length}
							footer={"Jumlah pengguna yang terdaftar : " + users.length}
						/>
						<CardMonitoring
							className="border-orange-500 basis-1/2"
							title={"UMKM Terajukkan"}
							content={waitVerified?.length}
							footer={"Jumlah UMKM Terajukan : " + waitVerified.length}
						/>
						<CardMonitoring
							className="border-red-500 basis-1/2"
							title={"UMKM Tidak Terverifikasi"}
							content={notVerified?.length}
							footer={"Jumlah UMKM tidak terverifikasi : " + notVerified.length}
						/>
						<CardMonitoring
							className="border-green-500 basis-1/2"
							title={"UMKM Terverifikasi"}
							content={verified?.length}
							footer={"Jumlah UMKM yang terverifikasi : " + verified.length}
						/>
					</div>

					<Card className="mt-3">
						<Charts
							chartTitle={
								"Data Pengajuan Per Tahun " + new Date().getFullYear()
							}
							records={business}
							className="w-[95%] mx-auto"
						// chartTitle={"Data Statistik UMKM"}
						/>
					</Card>

					<Card className="mt-3 basis-1/2">
						<DataLists
							data={waitVerified}
							subHeaderMemo={true}
							tableName="Data UMKM Belum Diverifikasi"
							tableOptions={{
								rows: 5,
							}}
							filterFields={["bussines_name"]}
							columns={[
								{ field: "bussines_name", header: "Nama Usaha" },
								{ field: "bussines_desc", header: "Deskripsi" },
								{ field: "category.category_name", header: "Kategori" },
								{ field: "bussines_status", header: "Status" },
								{
									field: "actions",
									header: "Aksi",
									body: (rowData) => (
										<div className="flex gap-3">
											<button
												type="button"
												onClick={() => handleDetail(rowData)}
												className={`bg-blue-500 p-2 text-white rounded-lg hover:bg-blue-400`}
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
																handleUpdateStatus(
																	rowData.umkmid,
																	"NOT_VERIFIED"
																)
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
														Kategori Usaha :{" "}
														{selectedData.category.category_name}
														<br />
														<br />
														Deskripsi :
														<br />
														{selectedData?.bussines_desc}
														<br />
														Alamat : {selectedData?.bussines_address}
													</pre>
												</Modal>
											)}
										</div>
									),
								},
							]}
						/>
					</Card>
				</>
			) : (
				<>
					{businessByUser !== null &&
						businessByUser?.bussines_status === "VERIFIED" ? (
						<div className="bg-green-200 border border-green-500 p-3 rounded-lg text-green-900">
							<strong>STATUS!</strong> Usaha anda telah disetujui!
						</div>
					) : businessByUser !== null &&
						businessByUser?.bussines_status === "NOT_VERIFIED" ? (
						<div className="bg-red-200 border border-red-500 p-3 rounded-lg text-red-900">
							<strong>STATUS!</strong> Usaha anda tidak disetujui!
						</div>
					) : businessByUser?.bussines_status === "WAIT_VERIFIED" ? (
						<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
							<strong>STATUS!</strong> Pengajuan anda masih menunggu
							dikonfirmasi!
						</div>
					) : (
						<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
							<strong>PERHATIAN!</strong> Silahkan lakukan pengajuan pada usaha
							anda, untuk dilakukan pendataan!
						</div>
					)}

					<Card className="mt-3">
						<h1 className="font-medium italic text-2xl">
							Selamat Datang di Dashboard Pemilik Usaha Mikro Kecil Menengah
						</h1>
						<p>
							Disini anda dapat melakukan pengajuan Usaha anda untuk melakukan
							pendataan usaha anda!
						</p>
					</Card>

					<div className="grid grid-cols-4 gap-3 mt-3">
						{events?.length > 0 ? (
							events?.map((data, key) => {
								return (
									<Card className="w-full" key={key}>
										<Image
											src={"/foto-events/" + data.event_foto}
											alt={data.event_name}
											width={1000}
											height={1000}
											className="w-full h-[200px] mb-3"
										/>
										<hr />
										<div className="mt-3">
											<div className="flex justify-between items-center">
												<span className="text-xl font-medium">
													{data.event_name}
												</span>
												<span
													className={
														new Date(data.event_date).toDateString() <
															new Date().toDateString()
															? "text-sm text-red-500 italic"
															: "text-sm text-green-500 italic"
													}
												>
													{new Date(data.event_date).toDateString()}
												</span>
											</div>
											<br />
											<p>{data.event_desc}</p>
										</div>
									</Card>
								);
							})
						) : (
							<div className="text-center">Tidak ada event tersedia!</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
