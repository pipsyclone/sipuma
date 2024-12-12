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
						<div className="relative w-full h-screen">
							<div className="flex justify-center items-center">
								<Middle className="basis-1/2 border">
									<Image
										src={IllustrationsLogin}
										alt="Ilustrations Login"
										width={1000}
										height={1000}
										className="w-[500px] h-auto"
									/>
								</Middle>
								<div className="basis-1/2 p-5">{children}</div>
							</div>
						</div>
					)}
				</body>
			</html>
		</AuthProvider>
	);
}
