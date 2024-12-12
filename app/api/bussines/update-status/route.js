import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
export async function PUT(request) {
	try {
		const umkmid = request.nextUrl.searchParams.get("umkmid");
		const body = await request.json();
		await prisma.UMKM.update({
			where: { umkmid },
			data: {
				bussines_status: body.status,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil mengubah status usaha!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
