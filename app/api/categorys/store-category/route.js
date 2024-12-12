import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function PUT(request) {
	try {
		const body = await request.json();
		const { categoryid, userid, category_name } = body;

		await prisma.categorys.upsert({
			where: { categoryid },
			update: {
				category_name,
			},
			create: {
				userid,
				category_name,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menambahkan / memperbarui kategori baru!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
