import prisma from "@/libs/prisma";
import md5 from "md5";
import { NextResponse } from "next/server";

export async function PUT(request) {
	try {
		const body = await request.json();
		const { type, userid, name, email, nophone, confirmPassword } = body;

		if (type === "update-password") {
			await prisma.users.update({
				where: { userid },
				data: {
					password: md5(confirmPassword),
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil mengubah kata sandi!",
			});
		}

		const emailExist = await prisma.users.findFirst({
			where: { email: body.email },
		});
		const phoneExist = await prisma.users.findFirst({
			where: { nophone: body.nophone },
		});
		const usernameExist = await prisma.users.findFirst({
			where: { username: body.username },
		});

		if (
			emailExist !== null &&
			emailExist.userid !== userid &&
			emailExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Email sudah digunakan pengguna lain!",
			});
		}

		if (
			phoneExist !== null &&
			phoneExist.userid !== userid &&
			phoneExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Nomor telepon sudah digunakan pengguna lain!",
			});
		}

		if (
			usernameExist !== null &&
			usernameExist.userid !== userid &&
			usernameExist.userid !== null
		) {
			return NextResponse.json({
				status: 400,
				message: "Username sudah digunakan pengguna lain!",
			});
		}

		await prisma.users.update({
			where: { userid },
			data: {
				name,
				email,
				nophone,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil mengubah data profile!",
		});
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
