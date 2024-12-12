"use client";
import Card from "@/components/ui/card";
import CardMonitoring from "@/components/ui/card-monitoring";
import Charts from "@/components/ui/charts";
import DataLists from "@/components/ui/datatable";
import { getBusiness, getBusinessByUser, getUsers } from "@/utils/custom-swr";
import Scripts from "@/utils/scripts";
import { useSession } from "next-auth/react";
import axios from "axios";
import { mutate } from "swr";

export default function IndexDashboard() {
	const { data: session } = useSession();
	const { toastAlert } = Scripts();
	const { users } = getUsers();
	const { business, verified, notVerified, waitVerified } = getBusiness();
	const { businessByUser } = getBusinessByUser(session.user.userid);

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
							content={users.length}
							footer={"Jumlah pengguna yang terdaftar : " + users.length}
						/>
						<CardMonitoring
							className="border-orange-500 basis-1/2"
							title={"UMKM Terajukkan"}
							content={waitVerified.length}
							footer={"Jumlah UMKM Terajukan : " + waitVerified.length}
						/>
						<CardMonitoring
							className="border-green-500 basis-1/2"
							title={"UMKM Terverifikasi"}
							content={verified.length}
							footer={"Jumlah UMKM yang terverifikasi : " + verified.length}
						/>
						<CardMonitoring
							className="border-red-500 basis-1/2"
							title={"UMKM Tidak Terverifikasi"}
							content={notVerified.length}
							footer={"Jumlah UMKM tidak terverifikasi : " + notVerified.length}
						/>
					</div>

					<Card className="mt-3">
						<Charts
							chartTitle={
								"Data Pengajuan Per Tahun " + new Date().getFullYear()
							}
							chartType={"line"}
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
								paginator: true,
								rows: 5,
								rowsPerPageOptions: [5, 10, 20],
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
												onClick={() =>
													handleUpdateStatus(rowData.umkmid, "VERIFIED")
												}
												className={`bg-green-500 p-2 text-white rounded-lg hover:bg-green-400`}
											>
												VERIFIKASI
											</button>
											<button
												type="button"
												onClick={() =>
													handleUpdateStatus(rowData.umkmid, "NOT_VERIFIED")
												}
												className={`bg-red-500 p-2 text-white rounded-lg hover:bg-green-400`}
											>
												TOLAK
											</button>
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
					) : (
						<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
							<strong>STATUS!</strong> Pengajuan anda masih menunggu
							dikonfirmasi!
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
				</>
			)}
		</>
	);
}