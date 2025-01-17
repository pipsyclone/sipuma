import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.users.findMany({
			where: {
				NOT: { role: "ADMIN" },
			},
		});
		const email = await prisma.users.findMany({
			where: { role: { contains: "BUSSINES_OWNER" } },
			select: {
				email: true,
			},
		});

		return NextResponse.json({ status: 200, message: "OK", data, email });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
