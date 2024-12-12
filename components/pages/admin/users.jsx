"use client";
import Card from "@/components/ui/card";
import DataLists from "@/components/ui/datatable";
import { getUsers } from "@/utils/custom-swr";
import axios from "axios";

export default function Users() {
	const { users } = getUsers();
	console.log(users);
	const handleDelete = async (userid) => {
		await axios
			.delete("/api/users/delete-user?userid=" + userid)
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert(
						"warning",
						"Kata Sandi Gagal!",
						"Form tidak boleh kosong!",
						3000
					);
				}
			});
	};
	return (
		<Card>
			<DataLists
				tableName="Data Pengguna"
				data={users}
				tableOptions={{
					paginator: true,
					rows: 5,
					rowsPerPageOptions: [5, 10, 20],
				}}
				subHeaderMemo={true}
				filterFields={["name"]}
				columns={[
					{ field: "name", header: "Nama Lengkap" },
					{ field: "email", header: "Email" },
					{ field: "nophone", header: "Nomor Telepon" },
					{
						field: "actions",
						header: "Aksi",
						body: (rowData) => (
							<div className="flex gap-3">
								<button
									type="button"
									onClick={() =>
										(window.location.href =
											"/dashboard/users/view/" + rowData.userid)
									}
									className={"p-2 bg-sky-500 rounded-lg text-white text-sm"}
								>
									Lihat
								</button>
								<button
									type="button"
									onClick={() => handleDelete(rowData.userid)}
									className={"p-2 bg-red-500 rounded-lg text-white text-sm"}
								>
									Hapus
								</button>
							</div>
						),
					},
				]}
			/>
		</Card>
	);
}
