import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.users.findMany({
			where: {
				NOT: { role: "ADMIN" },
			},
		});

		return NextResponse.json({ status: 200, message: "OK", data });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
