"use client";
import Scripts from "@/utils/scripts";
import axios from "axios";
import { useState } from "react";

export default function SignUp() {
	const { toastAlert } = Scripts();
	const [isLoading, setIsLoading] = useState(false);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [nophone, setNophone] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const phoneRegex = /^[0-9]{10,15}$/;

	const handleRegister = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		if (
			username == "" ||
			email == "" ||
			nophone == "" ||
			password == "" ||
			name == ""
		) {
			toastAlert(
				"error",
				"Formulir Error!",
				"Masih ada formulir yang kosong!",
				5000
			);
			setIsLoading(false);
		} else if (username.length < 6) {
			toastAlert(
				"error",
				"Username Error!",
				"Username minimal 6 karakter!",
				5000
			);
			setIsLoading(false);
		} else if (email && !emailRegex.test(email)) {
			toastAlert("error", "Email Error!", "Email anda tidak valid!", 5000);
			setIsLoading(false);
		} else if (nophone && !phoneRegex.test(nophone)) {
			toastAlert(
				"error",
				"Nomor Telepon Error!",
				"Nomor telepon harus berupa angka dan memiliki panjang 10-15 karakter!",
				5000
			);
			setIsLoading(false);
		} else if (name.length < 1) {
			toastAlert("error", "Name Error!", "Nama minimal 1 karakter!", 5000);
			setIsLoading(false);
		} else if (password.length < 6) {
			toastAlert(
				"error",
				"Password Error!",
				"Kata Sandi minimal 6 karakter!",
				5000
			);
			setIsLoading(false);
		} else {
			await axios
				.post("/api/auth/register", {
					username,
					email,
					nophone,
					password,
					name,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", res.data.title, res.data.message, 5000);
						setName("");
						setEmail("");
						setNophone("");
						setUsername("");
						setPassword("");
					} else
						return toastAlert("error", res.data.title, res.data.message, 5000);
				});
			setIsLoading(false);
		}
	};
	return (
		<div className="mx-auto flex flex-col gap-5 w-[500px]">
			<div className="text-center font-medium text-4xl">Daftar Akun SIPUMA</div>
			<hr />
			<form onSubmit={handleRegister} className="flex flex-col gap-5">
				<div className="flex flex-col gap-3 basis-1/2">
					<label>Masukkan Nama Pemilik Usaha : </label>
					<input
						type="text"
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-1 focus:ring-zinc-900 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Nama Pemilik Usaha"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<label>Masukkan Email : </label>
					<input
						type="email"
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-1 focus:ring-zinc-900 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Email Aktif"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<label>Masukkan Nomor HP / Whatsapp : </label>
					<input
						type="text"
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-1 focus:ring-zinc-900 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Nomor HP / Whatsapp"
						value={nophone}
						onChange={(e) => setNophone(e.target.value)}
					/>
				</div>
				<div className="flex gap-5">
					<div className="flex flex-col gap-3 grow basis-1/2">
						<label>Masukkan Username : </label>
						<input
							type="text"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-1 focus:ring-zinc-900 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-3 basis-1/2">
						<label>Masukkan Password : </label>
						<input
							type="password"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-1 focus:ring-zinc-900 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>
				<button
					type="submit"
					className={`bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-400 duration-500 ease-in-out ${
						isLoading ? "bg-blue-400 disabled" : ""
					}`}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<i className="fa-solid fa-spinner animate-spin me-3"></i> Loading
						</>
					) : (
						"Sign Up"
					)}
				</button>
			</form>
			<span>
				Sudah mempunyai akun?{" "}
				<a href="/signin" className="text-sky-500 italic">
					Masuk
				</a>
			</span>
		</div>
	);
}
