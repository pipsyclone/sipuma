import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";

export async function POST(request) {
	const formData = await request.formData();
	const userid = formData.get("userid");
	const categoryid = formData.get("categoryid");
	const owner_name = formData.get("owner_name");
	const bussines_name = formData.get("bussines_name");
	const bussines_foto = formData.get("bussines_foto");
	const bussines_proof = formData.get("bussines_proof");
	const bussines_proof_foto = formData.get("bussines_proof_foto");
	const bussines_desc = formData.get("bussines_desc");
	const bussines_address = formData.get("bussines_address");

	try {
		if (!CONFIG.ALLOWED_FILE_TYPE.includes(bussines_foto.type)) {
			return NextResponse.json({
				status: 400,
				message: "Tipe file tempat usaha tidak boleh kosong / tidak diizinkan, hanya JPG, JPEG, dan PNG!",
			});
		} else if (bussines_foto.size > CONFIG.MAX_FILE_SIZE) {
			return NextResponse.json({
				status: 400,
				message: "Ukuran file tempat usaha terlalu besar, tidak boleh lebih dari 2MB!",
			});
		}

		if (bussines_proof === "ya") {
			if (!CONFIG.ALLOWED_FILE_TYPE.includes(bussines_proof_foto.type)) {
				return NextResponse.json({
					status: 400,
					message: "Tipe file bukti pendirian usaha tidak boleh kosong / tidak diizinkan, hanya JPG, JPEG, dan PNG!",
				});
			} else if (!bussines_proof_foto.size > CONFIG.MAX_FILE_SIZE) {
				return NextResponse.json({
					status: 400,
					message: "Ukuran file bukti pendirian usaha terlalu besar, tidak boleh lebih dari 2MB!",
				});
			}

		}

		if (!fs.existsSync(CONFIG.DIRECTORY) || !fs.existsSync(CONFIG.DIRECTORY_PROOF)) {
			fs.mkdirSync(CONFIG.DIRECTORY);
			fs.mkdirSync(CONFIG.DIRECTORY_PROOF);
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

		if (bussines_proof === "ya") {
			const bufferProof = Buffer.from(await bussines_proof_foto.arrayBuffer());
			const originalProofFilename = bussines_proof_foto.name;
			const extensionProof = originalProofFilename.substring(
				originalProofFilename.lastIndexOf(".")
			);
			const proofFilename = Date.now() + extensionProof;

			await writeFile(
				path.join(process.cwd(), CONFIG.DIRECTORY_PROOF + proofFilename),
				bufferProof
			);

			await prisma.UMKM.upsert({
				where: { userid },
				update: {
					categoryid,
					owner_name,
					bussines_name,
					bussines_foto: filename,
					bussines_proof,
					bussines_proof_foto: proofFilename,
					bussines_desc,
					bussines_address,
				},
				create: {
					userid,
					categoryid,
					owner_name,
					bussines_name,
					bussines_foto: filename,
					bussines_proof,
					bussines_proof_foto: proofFilename,
					bussines_desc,
					bussines_address,
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil mengajukan usaha!",
			});
		} else {
			await prisma.UMKM.upsert({
				where: { userid },
				update: {
					categoryid,
					owner_name,
					bussines_name,
					bussines_foto: filename,
					bussines_proof,
					bussines_proof_foto: "-",
					bussines_desc,
					bussines_address,
				},
				create: {
					userid,
					categoryid,
					owner_name,
					bussines_name,
					bussines_foto: filename,
					bussines_proof,
					bussines_proof_foto: "-",
					bussines_desc,
					bussines_address,
				},
			});

			return NextResponse.json({
				status: 200,
				message: "Berhasil mengajukan usaha!",
			});
		}
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
