import prisma from "@/libs/prisma";
import md5 from "md5";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const body = await request.json();
		const { username, email, nophone, password, name } = body;

		const checkIdentifier = await prisma.users.findFirst({
			where: { OR: [{ username }, { email }, { nophone }] },
		});

		if (checkIdentifier) {
			return NextResponse.json({
				status: 203,
				title: "Gagal Membuat Akun!",
				message: "Username / Email / Nomor Telepon sudah digunakan!",
			});
		}

		await prisma.users.create({
			data: { username, email, nophone, password: md5(password), name },
		});

		return NextResponse.json({
			status: 200,
			title: "Berhasil Membuat Akun!",
			message: "Anda berhasil membuat akun, silahkan masuk pada halaman login!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
