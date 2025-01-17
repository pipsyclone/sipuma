"use client";
import Card from "@/components/ui/card";
import { getUserDetail } from "@/utils/custom-swr";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function UserDetail() {
	const params = useParams();
	const { userDetail, userUMKM } = getUserDetail(params.userid);

	return (
		<>
			{userUMKM !== null && userUMKM?.bussines_status === "VERIFIED" ? (
				<div className="bg-green-200 border border-green-500 p-3 rounded-lg text-green-900">
					<strong>STATUS!</strong> Usaha Ini telah disetujui!
				</div>
			) : userUMKM !== null && userUMKM?.bussines_status === "NOT_VERIFIED" ? (
				<div className="bg-red-200 border border-red-500 p-3 rounded-lg text-red-900">
					<strong>STATUS!</strong> Usaha Ini tidak disetujui!
				</div>
			) : userUMKM !== null && userUMKM?.bussines_status === "WAIT_VERIFIED" ? (
				<div className="bg-orange-200 border border-orange-500 p-3 rounded-lg text-orange-900">
					<strong>STATUS!</strong> Pengajuan Ini masih menunggu dikonfirmasi!
				</div>
			) : (
				<div className="bg-red-200 border border-red-500 p-3 rounded-lg text-red-900">
					<strong>STATUS!</strong> Pengguna ini belum melakukan pengajuan usaha!
				</div>
			)}
			<Card className="flex flex-col gap-3 mt-3 mb-3">
				<h1 className="font-medium italic">Detail Pengguna</h1>
				<hr />
				<form className="flex flex-col gap-3">
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Lengkap</label>
						<input
							type="text"
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
								placeholder="Email Aktif"
								defaultValue={userDetail?.email}
								readOnly
							/>
						</div>
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Nomor Telepon</label>
							<input
								type="text"
								placeholder="Nomor Telepon"
								defaultValue={userDetail?.nophone}
								readOnly
							/>
						</div>
					</div>
				</form>
			</Card>

			<Card
				className={
					(userUMKM !== null && userUMKM?.bussines_status === "VERIFIED") ||
					(userUMKM !== null && userUMKM?.bussines_status === "NOT_VERIFIED") ||
					(userUMKM !== null && userUMKM?.bussines_status === "WAIT_VERIFIED")
						? "flex flex-col gap-3 mt-3 mb-3"
						: "hidden"
				}
			>
				<h1 className="font-medium italic">Hasil Pengajuan UMKM</h1>
				<hr />
				<div className="flex flex-col md:flex-row gap-3">
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Pemilik Usaha</label>
						<input
							type="text"
							placeholder="Nama Lengkap"
							defaultValue={userUMKM?.owner_name}
							readOnly={userUMKM?.bussines_status === "VERIFIED" ? true : false}
						/>
					</div>
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Usaha</label>
						<input
							type="text"
							placeholder="Nama Usaha"
							defaultValue={userUMKM?.bussines_name}
							readOnly={userUMKM?.bussines_status === "VERIFIED" ? true : false}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2 basis-1/2">
					<Image
						src={"/foto-umkm/" + userUMKM?.bussines_foto}
						alt={userUMKM?.bussines_name || "Foto"}
						width={1000}
						height={1000}
						className="w-[500px] mx-auto"
					/>
				</div>
				<div className="flex flex-col gap-2 basis-1/2">
					<label className="text-sm">Deskripsi Usaha</label>
					<textarea
						rows={7}
						placeholder="Deskripsikan Usaha Anda Disini"
						defaultValue={userUMKM?.bussines_desc}
						readOnly={userUMKM?.bussines_status === "VERIFIED" ? true : false}
					></textarea>
				</div>
				<div className="flex flex-col gap-2 basis-1/2">
					<label className="text-sm">Alamat Usaha</label>
					<textarea
						rows={7}
						placeholder="Nomor Telepon"
						defaultValue={userUMKM?.bussines_address}
						readOnly={userUMKM?.bussines_status === "VERIFIED" ? true : false}
					></textarea>
				</div>
			</Card>
			{userUMKM?.products?.length < 1 ? (
				<div className="bg-red-200 border border-red-500 p-3 rounded-lg text-red-900">
					<strong>STATUS!</strong> Pengguna tersebut belum memasukkan produk
					usaha!
				</div>
			) : (
				<div className="grid grid-cols-4 gap-3">
					{userUMKM?.products?.map((data, key) => {
						return (
							<Card key={key}>
								<Image
									src={"/foto-produk/" + data.productimage}
									alt={data.productname}
									width={1000}
									height={1000}
									className="w-full h-[200px]"
								/>

								<div className="font-medium mt-3">{data.productname}</div>
							</Card>
						);
					})}
				</div>
			)}
		</>
	);
}
