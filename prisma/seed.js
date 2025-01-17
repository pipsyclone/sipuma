const { PrismaClient } = require("@prisma/client");
const md5 = require("md5");

const prisma = new PrismaClient();

async function main() {
	await prisma.users.upsert({
		where: { email: "admin@mail.com" },
		update: {},
		create: {
			username: "admin",
			email: "admin@mail.com",
			nophone: "6285155467000",
			password: md5("admin123"),
			name: "Admin",
			role: "ADMIN",
		},
	});
	await prisma.users.upsert({
		where: { email: "user1@mail.com" },
		update: {},
		create: {
			username: "user1",
			email: "user@mail.com",
			nophone: "628583294234",
			password: md5("user123"),
			name: "User 1",
		},
	});
	await prisma.users.upsert({
		where: { email: "user2@mail.com" },
		update: {},
		create: {
			username: "user2",
			email: "user2@mail.com",
			nophone: "62839453553",
			password: md5("user123"),
			name: "User 2",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
