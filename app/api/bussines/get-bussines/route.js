import { NextResponse } from "next/server";

export async function GET() {
	try {
		const [data, dataVerified, dataNotVerified, dataWaitVerified] =
			await Promise.all([
				prisma.UMKM.findMany(), // Mengambil semua data
				prisma.UMKM.findMany({ where: { bussines_status: "VERIFIED" } }),
				prisma.UMKM.findMany({ where: { bussines_status: "NOT_VERIFIED" } }),
				prisma.UMKM.findMany({ where: { bussines_status: "WAIT_VERIFIED" } }),
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
