"use client";
import { useState } from "react";
import Image from "next/image";
import UserImage from "@/assets/user.png";
import Logo from "@/assets/logo.png";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";

export default function Dashboard(props) {
	const { data: session } = useSession();
	const [sidebar, setSidebar] = useState(false);

	return (
		<div className="bg-slate-100 relative w-full h-screen flex">
			<div
				className={
					sidebar
						? "block sm:hidden fixed bg-slate-700 opacity-25 w-full h-screen z-20"
						: "hidden fixed bg-slate-700 opacity-75 w-full h-screen z-20"
				}
			></div>
			<div
				className={
					sidebar
						? "ms-0 sm:ms-[-300px] fixed bg-zinc-900 w-[300px] h-screen duration-500 ease-in-out z-20 p-3"
						: "ms-[-300px] sm:ms-0 fixed bg-zinc-900 w-[300px] h-screen duration-500 ease-in-out z-20 p-3"
				}
			>
				<div className="relative flex gap-3 mb-3">
					<Image
						src={Logo}
						alt="Logo"
						width={0}
						height={0}
						style={{ width: "40px", height: "auto", alignSelf: "center" }}
					/>
					<div className="flex flex-col text-white">
						<small>Sistem Informasi UMKM</small>
						<small>Majalengka</small>
					</div>
					<button
						type="button"
						className="absolute right-5 text-xl block sm:hidden"
						onClick={() => setSidebar(!sidebar)}
					>
						<i className="fa-solid fa-times"></i>
					</button>
				</div>
				<hr />
				<div className="flex flex-col gap-3 mt-3">
					<a
						href="/dashboard"
						className="flex border-0 bg-zinc-300 text-zinc-900 rounded-lg p-2 duration-500 ease-in-out"
					>
						<div className="w-12 text-center">
							<i className="fa-solid fa-home"></i>
						</div>
						Beranda
					</a>

					{session?.user?.role === "ADMIN" ? (
						<>
							<a
								href="/dashboard/users"
								className="flex text-white border-0  hover:bg-zinc-300 hover:text-zinc-900 rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-users"></i>
								</div>
								Pengguna
							</a>
							<a
								href="/dashboard/management-bussines"
								className="flex text-white border-0  hover:bg-zinc-300 hover:text-zinc-900 rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-store"></i>
								</div>
								Manajemen Pelaku Usaha
							</a>
							<a
								href="/dashboard/category"
								className="flex text-white border-0  hover:bg-zinc-300 hover:text-zinc-900 rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-box"></i>
								</div>
								Manajemen Kategori Usaha
							</a>
							<a
								href="/dashboard/event"
								className="flex text-white border-0  hover:bg-zinc-300 hover:text-zinc-900 rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-calendar"></i>
								</div>
								Event
							</a>
						</>
					) : (
						<>
							<a
								href="/dashboard/bussines-submission"
								className="flex text-white border-0  hover:bg-zinc-300 hover:text-zinc-900 rounded-lg p-2 duration-500 ease-in-out"
							>
								<div className="w-12 text-center">
									<i className="fa-solid fa-store"></i>
								</div>
								Pengajuan Usaha
							</a>
						</>
					)}
				</div>
			</div>
			<div
				className={
					sidebar
						? "flex flex-col w-screen h-screen ms-0 duration-500 ease-in-out"
						: "flex flex-col w-screen h-screen ms-0 sm:ms-[300px] duration-500 ease-in-out"
				}
			>
				<nav className="bg-white text-zinc-500 p-3 ps-5 pe-5 flex justify-between items-center">
					<button
						type="button"
						className="text-2xl"
						onClick={() => setSidebar(!sidebar)}
					>
						{sidebar ? (
							<i className="fa-solid fa-times"></i>
						) : (
							<i className="fa-solid fa-bars"></i>
						)}
					</button>

					<div className="flex gap-8 items-center">
						{/* <div className="relative inline-block text-left">
							<button type="button" onClick={() => setNotif(!notif)}>
								<span className="absolute ms-2 flex h-3 w-3">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
								</span>
								<i className="fa-solid fa-bell"></i>
							</button>

							<div
								className={
									notif
										? "absolute right-0 sm:mx-auto z-10 mt-3 w-56 origin-top-right bg-white rounded-lg p-3 text-slate-500"
										: "hidden"
								}
							>
								Hello World
							</div>
						</div> */}

						<a
							href="/dashboard/settings"
							className="flex gap-1 text-sm italic items-center"
						>
							<Image
								src={UserImage}
								alt="user"
								width={30}
								height={30}
								className="rounded-full"
							/>
							Hi, {session?.user?.name}
						</a>
					</div>
				</nav>

				<div className="p-5">{props.content}</div>
				<div className="bg-zinc-900 text-slate-400 italic text-sm mt-auto p-5 w-full">
					SIPUMA
				</div>
			</div>
		</div>
	);
}
