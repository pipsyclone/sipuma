"use client";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { useState, useEffect } from "react";
import AuthProvider from "@/context/AuthProvider";
import Dashboard from "@/components/pages/admin/template";
import Loading from "@/components/ui/loading";

export default function DashboardLayout({ children }) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setIsLoading(false), 1000);
	}, []);

	return (
		<AuthProvider>
			<html lang="en">
				<body>
					{isLoading ? <Loading /> : <Dashboard content={children} />}
				</body>
			</html>
		</AuthProvider>
	);
}
