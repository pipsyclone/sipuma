import BussinesSubmission from "@/components/pages/admin/bussines-submission";

export const metadata = {
	icons: "./logo.png",
	title: "Ajukan Usaha Anda",
	description: "Anda dapat mengajukan usaha anda disini!",
};

export default function DashboardHome() {
	return <BussinesSubmission />;
}