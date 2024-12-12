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
