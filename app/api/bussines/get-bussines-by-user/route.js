import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");

		const dataBussines = await prisma.UMKM.findFirst({
			where: { userid },
		});

		return NextResponse.json({
			status: 200,
			message: "OK",
			data: dataBussines,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
