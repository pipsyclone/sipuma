import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(request) {
	try {
		const eventid = request.nextUrl.searchParams.get("eventid");
		const image = request.nextUrl.searchParams.get("image");

		await prisma.events.delete({
			where: { eventid },
		});

		const absolutePath = path.join(process.cwd(), "public/foto-events/", image);
		fs.unlinkSync(absolutePath);

		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus event!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
