import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request) {
	try {
		const umkmid = request.nextUrl.searchParams.get("umkmid");

		const data = await prisma.products.findMany({
			where: { umkmid },
		});

		return NextResponse.json({
			status: 200,
			message: "OK",
			data,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
