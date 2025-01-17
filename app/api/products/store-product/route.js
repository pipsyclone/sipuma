import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CONFIG } from "@/global/config";

export async function PUT(request) {
	const formData = await request.formData();
	const productid = formData.get("productid");
	const umkmid = formData.get("umkmid");
	const productname = formData.get("productname");
	const productimage = formData.get("productimage");
	try {
		if (umkmid === "undefined") {
			return NextResponse.json({
				status: 400,
				message:
					"Anda belum melakukan pengajuan usaha, silahkan ajukan terlebih dahulu!",
			});
		}

		if (!CONFIG.ALLOWED_FILE_TYPE.includes(productimage.type)) {
			return NextResponse.json({
				status: 400,
				message: "Tipe file tidak diizinkan, hanya JPG, JPEG, dan PNG!",
			});
		}

		if (productimage.size > CONFIG.MAX_FILE_SIZE) {
			return NextResponse.json({
				status: 400,
				message: "Ukuran file terlalu besar, tidak boleh lebih dari 2MB!",
			});
		}

		// Ensure directory exists
		if (!fs.existsSync(CONFIG.DIRECTORY_PRODUCTS)) {
			fs.mkdirSync(CONFIG.DIRECTORY_PRODUCTS, { recursive: true });
		}

		// Create unique filename
		const buffer = Buffer.from(await productimage.arrayBuffer());
		const originalFilename = productimage.name;
		const extension = path.extname(originalFilename);
		const filename = `${Date.now()}${extension}`;
		const filePath = path.join(
			process.cwd(),
			CONFIG.DIRECTORY_PRODUCTS,
			filename
		);

		// Write file to disk
		await writeFile(filePath, buffer);

		// Update or create product with image
		await prisma.products.upsert({
			where: { productid },
			update: { productname, productimage: filename },
			create: { umkmid, productname, productimage: filename },
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil menambahkan / memperbarui produk baru dengan gambar!",
		});
	} catch (err) {
		console.error("Error:", err);
		return NextResponse.json({
			status: 500,
			message: `Internal Server Error: ${err.message}`,
		});
	}
}
