import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";

export async function PUT(request) {
	const formData = await request.formData();
	const eventid = formData.get("eventid");
	const userid = formData.get("userid");
	const event_name = formData.get("event_name");
	const event_foto = formData.get("event_foto");
	const event_date = formData.get("event_date");
	const event_desc = formData.get("event_desc");

	try {
		if (!CONFIG.ALLOWED_FILE_TYPE.includes(event_foto.type)) {
			return NextResponse.json({
				status: 400,
				message: "Tipe file tidak diizinkan, hanya JPG, JPEG, dan PNG!",
			});
		} else if (event_foto.size > CONFIG.MAX_FILE_SIZE) {
			return NextResponse.json({
				status: 400,
				message: "Ukuran file terlalu besar, tidak boleh lebih dari 2MB!",
			});
		}

		if (!fs.existsSync(CONFIG.DIRECTORY_EVENTS)) {
			fs.mkdirSync(CONFIG.DIRECTORY_EVENTS);
		}

		const buffer = Buffer.from(await event_foto.arrayBuffer());
		const originalFilename = event_foto.name;
		const extension = originalFilename.substring(
			originalFilename.lastIndexOf(".")
		);
		const filename = Date.now() + extension;

		await writeFile(
			path.join(process.cwd(), CONFIG.DIRECTORY_EVENTS + filename),
			buffer
		);

		await prisma.events.upsert({
			where: { eventid },
			update: {
				event_name,
				event_foto: filename,
				event_date: new Date(event_date).toISOString(),
				event_desc,
			},
			create: {
				userid,
				event_name,
				event_foto: filename,
				event_date: new Date(event_date).toISOString(),
				event_desc,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menambahkan / memperbarui event baru!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
