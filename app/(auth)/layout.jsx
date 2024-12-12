"use client";
import { useState, useEffect } from "react";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";

import IllustrationsLogin from "@/assets/illustrations/illustration-03.svg";
import Middle from "@/components/ui/middle";
import Loading from "@/components/ui/loading";
import AuthProvider from "@/context/AuthProvider";

export default function AuthLayout({ children }) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setIsLoading(false), 1000);
	}, []);

	return (
		<AuthProvider>
			<html lang="en">
				<body>
					{isLoading ? (
						<Loading />
					) : (
						<div className="block md:relative w-full h-screen">
							<div className="flex flex-col md:flex-row justify-normal md:justify-center items-stretch md:items-center">
								<Middle className="hidden md:block basis-1/2">
									<Image
										src={IllustrationsLogin}
										alt="Ilustrations Login"
										width={1000}
										height={1000}
										className="w-[500px]"
									/>
								</Middle>
								<Image
									src={IllustrationsLogin}
									alt="Ilustrations Login"
									width={1000}
									height={1000}
									className="w-[100px] mx-auto m-5 block md:hidden"
								/>
								<div className="p-5 basis-1/2">{children}</div>
							</div>
						</div>
					)}
				</body>
			</html>
		</AuthProvider>
	);
}
