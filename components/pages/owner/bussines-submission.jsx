"use client";
import Card from "@/components/ui/card";
import { getBusinessByUser, getCategorys } from "@/utils/custom-swr";
import Scripts from "@/utils/scripts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BussinesSubmission() {
	const { data: session } = useSession();
	const { businessByUser } = getBusinessByUser(session?.user?.userid);
	const { categorys } = getCategorys();
	const { toastAlert } = Scripts();

	const [userid] = useState(session?.user?.userid);
	const [categoryid, setCategoryid] = useState("");
	const [owner_name, setOwnerName] = useState("");
	const [bussines_name, setBussinesName] = useState("");
	const [bussines_foto, setBussinesFoto] = useState(null);
	const [bussines_desc, setBussinesDesc] = useState("");
	const [bussines_address, setBussinesAddress] = useState("");

	useEffect(() => {
		if (businessByUser) {
			setCategoryid(businessByUser.categoryid);
			setOwnerName(businessByUser.owner_name);
			setBussinesName(businessByUser.bussines_name);
			setBussinesFoto(businessByUser.bussines_foto);
			setBussinesDesc(businessByUser.bussines_desc);
			setBussinesAddress(businessByUser.bussines_address);
		}
	}, [businessByUser]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setBussinesFoto(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			owner_name === "" ||
			bussines_name === "" ||
			bussines_desc === "" ||
			bussines_address === ""
		) {
			toastAlert("warning", "Form Error!", "Form masih ada yang kosong!", 3000);
		} else if (!bussines_foto) {
			toastAlert(
				"warning",
				"File Error!",
				"Silahkan masukkan foto toko / usaha anda!",
				3000
			);
		} else {
			const formData = new FormData();
			formData.append("userid", userid);
			formData.append("categoryid", categoryid);
			formData.append("owner_name", owner_name);
			formData.append("bussines_name", bussines_name);
			formData.append("bussines_foto", bussines_foto);
			formData.append("bussines_desc", bussines_desc);
			formData.append("bussines_address", bussines_address);

			await axios.post("/api/bussines/store-bussines", formData).then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", "Success Submitted!", res.data.message, 3000);
				} else {
					toastAlert("error", "Error Submitted!", res.data.message, 3000);
				}
			});
		}
	};

	return (
		<>
			<div className="mb-3 bg-sky-200 border border-sky-500 p-3 rounded-lg text-sky-900">
				<strong>INFORMASI!</strong> Anda masih dapat melakukan pengubahan data
				pengajuan selama status belum disetujui!
			</div>
			{businessByUser?.bussines_status === "VERIFIED" ? (
				<div className="bg-green-200 border border-green-500 p-3 rounded-lg text-green-900">
					<strong>STATUS!</strong> Usaha anda telah disetujui!
				</div>
			) : businessByUser?.bussines_status === "NOT_VERIFIED" ? (
				<div className="bg-red-200 border border-red-500 p-3 rounded-lg text-red-900">
					<strong>STATUS!</strong> Usaha anda tidak disetujui!
				</div>
			) : businessByUser?.bussines_status === "WAIT_VERIFIED" ? (
				<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
					<strong>STATUS!</strong> Pengajuan anda masih menunggu dikonfirmasi!
				</div>
			) : (
				<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
					<strong>PERHATIAN!</strong> Silahkan lakukan pengajuan pada usaha
					anda, untuk dilakukan pendataan!
				</div>
			)}

			<Card className="flex flex-col gap-3 mt-3">
				<h1 className="font-medium italic">Ajukan Usaha Anda Disini</h1>
				<hr />
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Nama Pemilik Usaha</label>
							<input
								type="text"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Nama Lengkap"
								value={owner_name}
								onChange={(e) => setOwnerName(e.target.value)}
								readOnly={
									businessByUser?.bussines_status === "VERIFIED" ? true : false
								}
							/>
						</div>
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Nama Usaha</label>
							<input
								type="text"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Nama Usaha"
								value={bussines_name}
								onChange={(e) => setBussinesName(e.target.value)}
								readOnly={
									businessByUser?.bussines_status === "VERIFIED" ? true : false
								}
							/>
						</div>
					</div>
					<div className="flex flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Foto / Usaha Anda</label>
							<input
								type="file"
								accept="image/*"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Masukkan Foto Toko / Usaha Anda"
								onChange={handleFileChange}
								readOnly={
									businessByUser?.bussines_status === "VERIFIED" ? true : false
								}
							/>
						</div>
						<div
							className="flex flex-col gap-2 basis-1/2"
							value={categoryid}
							onChange={(e) => setCategoryid(e.target.value)}
						>
							<label className="text-sm">Pilih Kategori Usaha : </label>
							<select className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out">
								<option value={""}>- Pilih Kategori -</option>
								{categorys.map((data, key) => {
									if (DataTransferItemList.categoryid === categoryid) {
										return (
											<option value={data.categoryid} key={key}>
												{data.category_name}
											</option>
										);
									} else {
										return (
											<option value={data.categoryid} key={key}>
												{data.category_name}
											</option>
										);
									}
								})}
							</select>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-sm">Deskripsi Usaha</label>
						<textarea
							rows={7}
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Deskripsikan Usaha Anda Disini"
							value={bussines_desc}
							onChange={(e) => setBussinesDesc(e.target.value)}
							readOnly={
								businessByUser?.bussines_status === "VERIFIED" ? true : false
							}
						></textarea>
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-sm">Alamat Usaha</label>
						<textarea
							rows={7}
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Nomor Telepon"
							value={bussines_address}
							onChange={(e) => setBussinesAddress(e.target.value)}
							readOnly={
								businessByUser?.bussines_status === "VERIFIED" ? true : false
							}
						></textarea>
					</div>
					<button
						type="submit"
						className="bg-blue-500 p-2 text-white ms-auto rounded-lg"
					>
						Simpan
					</button>
				</form>
			</Card>
		</>
	);
}
