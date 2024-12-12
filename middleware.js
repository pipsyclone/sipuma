import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
	const token = await getToken({ req: request });
	const pathname = request.nextUrl.pathname;

	if (!token && pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	if (token) {
		if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}
}

export const config = {
	matcher: ["/signin", "/signup", "/dashboard/:path*"],
};
