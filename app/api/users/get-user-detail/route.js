import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const userid = request.nextUrl.searchParams.get("userid");
		const data = await prisma.users.findFirst({
			where: { userid },
		});

		return NextResponse.json({ status: 200, message: "OK", data });
	} catch (err) {
		return NextResponse.json({ status: 500, message: err.message });
	}
}
