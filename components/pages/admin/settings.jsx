"use client";
import Card from "@/components/ui/card";
import { getUserDetail } from "@/utils/custom-swr";
import Scripts from "@/utils/scripts";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Settings() {
	const { data: session, status } = useSession();
	const { userDetail } = getUserDetail(session.user.userid);
	const { toastAlert } = Scripts();
	const [showPassword, setShowPassword] = useState(false);

	// const [userDetail, setUserDetail] = useState(null);
	const [userid] = useState(session.user.userid);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [nophone, setNophone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		// Update state setiap kali userDetail berubah
		if (userDetail) {
			setName(userDetail.name || "");
			setEmail(userDetail.email || "");
			setNophone(userDetail.nophone || "");
		}
	}, [userDetail]);

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		if (name === "" || email === "" || nophone === "") {
			toastAlert(
				"warning",
				"Kata Sandi Gagal!",
				"Form tidak boleh kosong!",
				3000
			);
		} else {
			await axios
				.put("/api/users/update-user", {
					type: "update-profile",
					userid,
					name,
					email,
					nophone,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", "Berhasil", res.data.message, 3000);
						signOut();
					} else {
						toastAlert("error", "Gagal mengubah data!", res.data.message, 3000);
					}
				});
		}
	};

	const handleUpdatePassword = async (e) => {
		e.preventDefault();

		if (password === "" || confirmPassword === "") {
			toastAlert(
				"warning",
				"Kata Sandi Gagal!",
				"Form tidak boleh kosong!",
				3000
			);
		} else if (password !== confirmPassword) {
			toastAlert(
				"warning",
				"Kata Sandi Gagal!",
				"Konfirmasi kata sandi harus sama dengan kata sandi!",
				3000
			);
		} else {
			await axios
				.put("/api/users/update-user", {
					type: "update-password",
					userid,
					confirmPassword,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", "Berhasil!", res.data.message, 3000);
						setPassword("");
						setConfirmPassword("");
					} else {
						toastAlert("error", "Gagal mengubah data!", res.data.message, 3000);
					}
				});
		}
	};

	return (
		<>
			<Card className="flex flex-col gap-3">
				<h1 className="font-medium italic">Pengaturan Pengguna</h1>
				<hr />
				<form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
					<div className="flex flex-col gap-2 basis-1/2">
						<label className="text-sm">Nama Lengkap</label>
						<input
							type="text"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Nama Lengkap"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Email</label>
							<input
								type="email"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Email Aktif"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Nomor Telepon</label>
							<input
								type="text"
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Nomor Telepon"
								value={nophone}
								onChange={(e) => setNophone(e.target.value)}
							/>
						</div>
					</div>
					<button
						type="submit"
						className="bg-blue-500 p-2 text-white ms-auto rounded-lg"
					>
						Simpan
					</button>
				</form>
			</Card>
			<Card className="mt-3 flex flex-col gap-3">
				<h1 className="font-medium italic">Keamanan</h1>
				<hr />
				<form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
					<div className="flex flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Kata Sandi Baru</label>
							<input
								type={showPassword ? "text" : "password"}
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Kata Sandi Baru"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2 basis-1/2">
							<label className="text-sm">Konfirmasi Kata Sandi</label>
							<input
								type={showPassword ? "text" : "password"}
								className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
								placeholder="Konfirmasi Kata Sandi Baru"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<input
							type="checkbox"
							id="show-password"
							checked={showPassword}
							onChange={(e) => setShowPassword(e.target.checked)}
						/>
						<label htmlFor="show-password">Lihat Kata Sandi</label>
					</div>

					<button
						type="submit"
						className="bg-blue-500 p-2 text-white ms-auto rounded-lg"
					>
						Simpan Kata Sandi
					</button>
				</form>
			</Card>
			<Card className="mt-3 flex flex-col gap-3">
				<h1 className="font-medium italic">Akun</h1>
				<hr />
				<button
					type="button"
					onClick={() => signOut()}
					className="bg-red-500 p-2 text-white ms-auto rounded-lg"
				>
					Keluar
				</button>
			</Card>
		</>
	);
}
