import { NextResponse } from "next/server";

export async function GET() {
	try {
		const [data, dataVerified, dataNotVerified, dataWaitVerified] =
			await Promise.all([
				prisma.UMKM.findMany({
					include: { category: true }, // Properti include di sini sudah benar
				}),
				prisma.UMKM.findMany({
					where: { bussines_status: "VERIFIED" }, // where di sini sudah benar
					include: { category: true }, // Tambahkan include di tingkat ini
				}),
				prisma.UMKM.findMany({
					where: { bussines_status: "NOT_VERIFIED" },
					include: { category: true },
				}),
				prisma.UMKM.findMany({
					where: { bussines_status: "WAIT_VERIFIED" },
					include: { category: true },
				}),
			]);

		return NextResponse.json({
			status: 200,
			message: "OK",
			data,
			dataVerified,
			dataNotVerified,
			dataWaitVerified,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
