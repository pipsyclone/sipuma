import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
	try {
		const data = await prisma.events.findMany();

		return NextResponse.json({
			status: 200,
			message: "OK",
			data,
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
