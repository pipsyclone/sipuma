import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";

export async function POST(request) {
	const formData = await request.formData();
	const userid = formData.get("userid");
	const owner_name = formData.get("owner_name");
	const bussines_name = formData.get("bussines_name");
	const bussines_foto = formData.get("bussines_foto");
	const bussines_desc = formData.get("bussines_desc");
	const bussines_address = formData.get("bussines_address");

	try {
		if (!CONFIG.ALLOWED_FILE_TYPE.includes(bussines_foto.type)) {
			return NextResponse.json({
				status: 400,
				message: "Tipe file tidak diizinkan, hanya JPG, JPEG, dan PNG!",
			});
		} else if (bussines_foto.size > CONFIG.MAX_FILE_SIZE) {
			return NextResponse.json({
				status: 400,
				message: "Ukuran file terlalu besar, tidak boleh lebih dari 2MB!",
			});
		}

		if (!fs.existsSync(CONFIG.DIRECTORY)) {
			fs.mkdirSync(CONFIG.DIRECTORY);
		}

		const buffer = Buffer.from(await bussines_foto.arrayBuffer());
		const originalFilename = bussines_foto.name;
		const extension = originalFilename.substring(
			originalFilename.lastIndexOf(".")
		);
		const filename = Date.now() + extension;

		await writeFile(
			path.join(process.cwd(), CONFIG.DIRECTORY + filename),
			buffer
		);

		await prisma.UMKM.upsert({
			where: { userid },
			update: {
				userid,
				owner_name,
				bussines_name,
				bussines_foto: filename,
				bussines_desc,
				bussines_address,
			},
			create: {
				userid,
				owner_name,
				bussines_name,
				bussines_foto: filename,
				bussines_desc,
				bussines_address,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil mengajukan usaha!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
