"use client";
import { useEffect } from "react";

export default function RootLayout({ children }) {
	useEffect(() => {
		window.location.href = "/signin";
	}, []);

	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
