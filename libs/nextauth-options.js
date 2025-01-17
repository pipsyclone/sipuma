import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import md5 from "md5";

export const options = {
	type: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			type: "credentials",
			credentials: {
				identifier: {
					label: "Useranme",
					type: "text",
					placeholder: "Username",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Masukkan Password",
				},
			},
			async authorize(credentials) {
				const { identifier, password } = credentials;
				const user = await prisma.users.findFirst({
					where: {
						OR: [{ username: identifier }, { email: identifier }],
					},
				});

				if (
					(identifier === user.username || identifier === user.email) &&
					md5(password) === user.password
				) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, // 2 Days Expire
	},
	pages: {
		signIn: "/signin",
		signUp: "/signup",
		signOut: "/signin",
	},
	callbacks: {
		async jwt(params) {
			// Update Token
			if (params.user) {
				params.token.userid = params.user.userid;
				params.token.role = params.user.role;
			}

			// Return Final Token
			return params.token;
		},
		async session({ session, token }) {
			// Menyimpan username ke dalam session untuk dikirimkan ke client
			session.user.userid = token.userid;
			session.user.role = token.role;

			return session;
		},
	},
};
