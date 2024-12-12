"use client";
import Card from "@/components/ui/card";
import { getBusinessByUser, getUserDetail } from "@/utils/custom-swr";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function UserDetail() {
	const params = useParams();
	const { userDetail } = getUserDetail(params.userid);
	const { businessByUser } = getBusinessByUser(params.userid);

	return (
		<>
			<Card className="flex flex-col gap-3 mb-3">
				<h1 className="font-medium italic">Detail Pengguna</h1>
				<hr />
				<form className="flex flex-col gap-3">
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Lengkap</label>
						<input
							type="text"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Nama Lengkap"
							defaultValue={userDetail?.name}
							readOnly
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Email</label>
							<input
								type="email"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Email Aktif"
								defaultValue={userDetail?.email}
								readOnly
							/>
						</div>
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Nomor Telepon</label>
							<input
								type="text"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Nomor Telepon"
								defaultValue={userDetail?.nophone}
								readOnly
							/>
						</div>
					</div>
				</form>
			</Card>

			{businessByUser !== null &&
			businessByUser?.bussines_status === "VERIFIED" ? (
				<div className="bg-green-200 border border-green-500 p-3 rounded-lg text-green-900">
					<strong>STATUS!</strong> Usaha Ini telah disetujui!
				</div>
			) : businessByUser !== null &&
			  businessByUser?.bussines_status === "NOT_VERIFIED" ? (
				<div className="bg-red-200 border border-red-500 p-3 rounded-lg text-red-900">
					<strong>STATUS!</strong> Usaha Ini tidak disetujui!
				</div>
			) : (
				<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
					<strong>STATUS!</strong> Pengajuan Ini masih menunggu dikonfirmasi!
				</div>
			)}

			<Card className="flex flex-col gap-3 mt-3">
				<h1 className="font-medium italic">Hasil Pengajuan UMKM</h1>
				<hr />
				<div className="flex flex-col md:flex-row gap-3">
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Pemilik Usaha</label>
						<input
							type="text"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Nama Lengkap"
							defaultValue={businessByUser?.owner_name}
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
							defaultValue={businessByUser?.bussines_name}
							readOnly={
								businessByUser?.bussines_status === "VERIFIED" ? true : false
							}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2 basis-1/2">
					<Image
						src={"/foto-umkm/" + businessByUser?.bussines_foto}
						alt={businessByUser?.bussines_name || "Foto"}
						width={1000}
						height={1000}
						className="w-[500px] mx-auto"
					/>
				</div>
				<div className="flex flex-col gap-2 basis-1/2">
					<label className="text-sm">Deskripsi Usaha</label>
					<textarea
						rows={7}
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Deskripsikan Usaha Anda Disini"
						defaultValue={businessByUser?.bussines_desc}
						readOnly={
							businessByUser?.bussines_status === "VERIFIED" ? true : false
						}
					></textarea>
				</div>
				<div className="flex flex-col gap-2 basis-1/2">
					<label className="text-sm">Alamat Usaha</label>
					<textarea
						rows={7}
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Nomor Telepon"
						defaultValue={businessByUser?.bussines_address}
						readOnly={
							businessByUser?.bussines_status === "VERIFIED" ? true : false
						}
					></textarea>
				</div>
			</Card>
		</>
	);
}
