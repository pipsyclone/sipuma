import IndexDashboard from "@/components/pages/admin/home";

export const metadata = {
	icons: "./logo.png",
	title: "Selamat datang di dashboard SIPUMA",
	description: "Anda dapat mengajukan usaha anda disini!",
};

export default function DashboardHome() {
	return <IndexDashboard />;
}
