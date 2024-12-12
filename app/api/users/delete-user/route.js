import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");
		await prisma.users.delete({
			where: { userid },
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus pengguna!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
