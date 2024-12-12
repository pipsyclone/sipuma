"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

import Scripts from "@/utils/scripts";
import Loading from "@/components/ui/loading";

export default function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toastAlert } = Scripts();

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		signIn("credentials", { identifier, password, redirect: false }).then(
			async (res) => {
				if (res.error) {
					toastAlert(
						"error",
						"Could'nt Authorization!",
						"Invalid username or password!",
						5000
					);
				} else return (window.location.href = "/dashboard");
				setIsLoading(false);
			}
		);
	};

	if (isLoading) return <Loading />;

	return (
		<div className="mx-auto flex flex-col gap-5 w-full md:w-[500px]">
			<div className="text-center font-medium text-2xl md:text-4xl">
				Masuk ke SIPUMA
			</div>
			<hr />
			<form onSubmit={handleLogin} className="flex flex-col gap-5">
				<div className="flex flex-col gap-3">
					<label>Masukkan Username / Email : </label>
					<input
						type="text"
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Username / Email"
						value={identifier}
						onChange={(e) => setIdentifier(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-3">
					<label>Masukkan Password : </label>
					<input
						type={showPassword ? "text" : "password"}
						className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-1 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="flex gap-3">
					<input
						type="checkbox"
						id="show-password"
						checked={showPassword}
						onChange={(e) => setShowPassword(e.target.checked)}
					/>
					<label htmlFor="show-password">Show Password</label>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-400 duration-500 ease-in-out"
				>
					Sign In
				</button>
			</form>
			<span>
				Tidak mempunyai akun?{" "}
				<a href="/signup" className="text-sky-500 italic">
					Daftar
				</a>
			</span>
		</div>
	);
}
