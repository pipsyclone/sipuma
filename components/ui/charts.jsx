import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function Charts({
	chartTitle,
	records,
	className = "",
}) {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const processedData = Array(12)
			.fill(0)
			.map((_, index) => ({
				month: new Date(0, index).toLocaleString("default", { month: "long" }),
				verified: 0,
				notVerified: 0,
				waitToVerified: 0,
			}));

		records.forEach((record) => {
			const date = new Date(record.createdAt);
			const monthIndex = date.getMonth();

			if (record.bussines_status === "VERIFIED") {
				processedData[monthIndex].verified += 1;
			} else if (record.bussines_status === "NOT_VERIFIED") {
				processedData[monthIndex].notVerified += 1;
			} else if (record.bussines_status === "WAIT_VERIFIED") {
				processedData[monthIndex].waitToVerified += 1;
			}
		});

		setChartData({
			labels: processedData.map((d) => d.month),
			datasets: [
				{
					label: "Di Verifikasi",
					data: processedData.map((d) => d.verified),
					backgroundColor: getComputedStyle(
						document.documentElement
					).getPropertyValue("--green-500"),
				},
				{
					label: "Tidak Di Verifikasi",
					data: processedData.map((d) => d.notVerified),
					backgroundColor: getComputedStyle(
						document.documentElement
					).getPropertyValue("--red-500"),
				},
				{
					label: "Menunggu Di Verifikasi",
					data: processedData.map((d) => d.waitToVerified),
					backgroundColor: getComputedStyle(
						document.documentElement
					).getPropertyValue("--orange-500"),
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
			},
			scales: {
				x: {
					stacked: false,
				},
				y: {
					beginAtZero: true,
				},
			},
		});
	}, [records]);

	return (
		<Chart
			type="bar"
			data={chartData}
			options={chartOptions}
			className={className}
		/>
	);
}
