import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
	try {
		const categoryid = request.nextUrl.searchParams.get("categoryid");
		await prisma.categorys.delete({
			where: { categoryid },
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus kategori!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
