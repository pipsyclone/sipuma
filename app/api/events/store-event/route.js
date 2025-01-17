import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";
import nodemailer from "nodemailer";

export async function PUT(request) {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // true for port 465, false for other ports
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_APP_PASSWORD,
		},
	});

	const formData = await request.formData();
	const eventid = formData.get("eventid");
	const userid = formData.get("userid");
	const emailrecipients = formData.get("emailrecipients");
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

		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: '"SIPUMA" <sipuma@mail.com>', // sender address
			to: emailrecipients, // list of receivers
			subject: "Ada Event UMKM Baru Nih!", // Subject line
			html: `
					<div style="background-color: #16a34a; padding-top: 20px; padding-bottom: 20px; width: 100%; text-align: center; font-weight: bold; font-size: 24pt; color: white;">Pemberitahuan EVENT</div>
					<hr style="margin: 20px 20px; border-radius: 10px;">
					<p><span style="font-family: arial, helvetica, sans-serif;">Pemberitahuan event baru UMKM Majalengka!</span></p>
					<p>&nbsp;</p>
					<p><span style="font-family: arial, helvetica, sans-serif;">${event_name} <br /> Tanggal ${new Date(
				event_date
			).toDateString()} <br /> <br /> ${event_desc}</span></p>
					<p>&nbsp;</p>
					<p><span style="font-family: arial, helvetica, sans-serif;">Terima Kasih, Pengembang SIPUMA.</span></p>
						`, // html body
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menambahkan / memperbarui event baru!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
