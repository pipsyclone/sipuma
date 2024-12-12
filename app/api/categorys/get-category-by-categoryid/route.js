import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const categoryid = request.nextUrl.searchParams.get("categoryid");
		const data = await prisma.categorys.findFirst({
			where: { categoryid },
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
