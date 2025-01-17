import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(request) {
	try {
		const productid = request.nextUrl.searchParams.get("productid");
		const image = request.nextUrl.searchParams.get("image");

		await prisma.products.delete({
			where: { productid },
		});

		const absolutePath = path.join(process.cwd(), "public/foto-produk/", image);
		fs.unlinkSync(absolutePath);

		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus produk!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
