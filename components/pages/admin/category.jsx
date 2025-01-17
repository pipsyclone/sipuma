"use client";
import Card from "@/components/ui/card";
import Scripts from "@/utils/scripts";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DataLists from "@/components/ui/datatable";
import { getCategorys } from "@/utils/custom-swr";
import { mutate } from "swr";

export default function Category() {
	const { data: session } = useSession();
	const { toastAlert } = Scripts();
	const { categorys } = getCategorys();

	console.log(categorys);

	const [userid] = useState(session?.user?.userid);
	const [categoryid, setCategoryid] = useState("");
	const [category_name, setCategoryName] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (category_name === "") {
			toastAlert(
				"warning",
				"Form Error!",
				"Nama kategori tidak boleh kosong!",
				3000
			);
		} else {
			await axios
				.put("/api/categorys/store-category", {
					categoryid,
					userid,
					category_name,
				})
				.then((res) => {
					if (res.data.status === 200) {
						toastAlert("success", "Success Submitted!", res.data.message, 3000);
						setCategoryid("");
						setCategoryName("");
					} else {
						toastAlert("error", "Error Submitted!", res.data.message, 3000);
					}

					mutate("/api/categorys/get-categorys");
				});
		}
	};

	const handleUpdate = (data) => {
		setCategoryid(data?.categoryid);
		setCategoryName(data?.category_name);
	};

	const handleDelete = async (categoryid) => {
		await axios
			.delete("/api/categorys/delete-by-category?categoryid=" + categoryid)
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", "Success Deleted!", res.data.message, 3000);
				} else {
					toastAlert("error", "Error Deleted!", res.data.message, 3000);
				}

				mutate("/api/categorys/get-categorys");
			});
	};

	return (
		<div className="flex flex-col-reverse md:flex-row gap-3">
			<Card className="basis-1/2 self-start">
				<DataLists
					data={categorys}
					subHeaderMemo={true}
					tableName="Manajemen Kategori Usaha"
					tableOptions={{
						paginator: true,
						rows: 5,
						rowsPerPageOptions: [5, 10, 50, 100],
					}}
					filterFields={["category_name"]}
					columns={[
						{ field: "categoryid", header: "ID" },
						{ field: "category_name", header: "Nama Kategori" },
						{
							field: "actions",
							header: "Aksi",
							body: (rowData) => (
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => handleUpdate(rowData)}
										className={`bg-blue-500 p-2 text-white rounded-lg hover:bg-blue-400`}
									>
										UBAH
									</button>
									<button
										type="button"
										onClick={() => handleDelete(rowData.categoryid)}
										className={`bg-red-500 p-2 text-white rounded-lg hover:bg-red-400`}
									>
										HAPUS
									</button>
								</div>
							),
						},
					]}
				/>
			</Card>
			<Card className="basis-1/2 self-start">
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="mb-3 text-xl font-medium">Form Kateogori</div>
					<hr />
					<label className="mt-3">Masukkan Nama Kategori : </label>
					<input
						type="text"
						placeholder="Nama Kategori"
						value={category_name}
						onChange={(e) => setCategoryName(e.target.value)}
					/>
					<button
						type="submit"
						className="bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-400"
					>
						Simpan
					</button>
				</form>
			</Card>
		</div>
	);
}
