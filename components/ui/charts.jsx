import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function Charts({
	chartTitle,
	chartType,
	records,
	className = "",
}) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		// Inisialisasi array 12 bulan untuk menampung data
		const processedData = Array(12)
			.fill(0)
			.map((_, index) => ({
				month: new Date(0, index).toLocaleString("default", { month: "long" }),
				verified: 0,
				notVerified: 0,
				waitToVerified: 0, // Tambahkan status waitToVerified
			}));

		// Proses data dari records
		records.forEach((record) => {
			const date = new Date(record.createdAt); // Parse DateTime
			const monthIndex = date.getMonth(); // 0 = Januari, 1 = Februari, dst.

			// Hitung jumlah untuk setiap status
			if (record.bussines_status === "VERIFIED") {
				processedData[monthIndex].verified += 1;
			} else if (record.bussines_status === "NOT_VERIFIED") {
				processedData[monthIndex].notVerified += 1;
			} else if (record.bussines_status === "WAIT_VERIFIED") {
				processedData[monthIndex].waitToVerified += 1; // Tambahkan kondisi ini
			}
		});

		// Siapkan data untuk chart
		setChartData({
			labels: processedData.map((d) => d.month),
			datasets: [
				{
					label: "Verified",
					data: processedData.map((d) => d.verified),
					fill: false,
					borderColor: getComputedStyle(
						document.documentElement
					).getPropertyValue("--blue-500"),
					tension: 0.4,
				},
				{
					label: "Not Verified",
					data: processedData.map((d) => d.notVerified),
					fill: false,
					borderColor: getComputedStyle(
						document.documentElement
					).getPropertyValue("--red-500"),
					tension: 0.4,
				},
				{
					label: "Wait for Verified", // Dataset baru
					data: processedData.map((d) => d.waitToVerified),
					fill: false,
					borderColor: getComputedStyle(
						document.documentElement
					).getPropertyValue("--orange-500"),
					tension: 0.4,
				},
			],
		});

		setChartOptions({
			responsive: true,
			plugins: {
				legend: {
					position: "top",
				},
				title: {
					display: true,
					text: chartTitle,
				},
				customCanvasBackgroundColor: {
					color: "lightGreen",
				},
			},
		});
	}, [records]);

	return (
		<Chart
			type={chartType}
			data={chartData}
			options={chartOptions}
			className={className}
		/>
	);
}
