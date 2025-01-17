"use client";
import DataLists from "@/components/ui/datatable";
import Card from "@/components/ui/card";
import { useState } from "react";
import { mutate } from "swr";
import { getProductByUmkmid } from "@/utils/custom-swr";
import Scripts from "@/utils/scripts";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BussinesProducts() {
	const params = useParams();
	const { productByUmkmid } = getProductByUmkmid(params?.umkmid);
	const { toastAlert } = Scripts();

	const [productid, setProductid] = useState("");
	const [umkmid] = useState(params?.umkmid);
	const [productname, setProductName] = useState("");
	const [productimage, setProductImage] = useState(null);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProductImage(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("productid", productid);
		formData.append("umkmid", umkmid);
		formData.append("productname", productname);
		formData.append("productimage", productimage);

		if (productname === "") {
			toastAlert("warning", "Form Error!", "Form masih ada yang kosong!", 3000);
		} else {
			await axios.put("/api/products/store-product", formData).then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", "Success Submitted!", res.data.message, 3000);
					mutate("/api/products/get-product-by-umkmid?umkid=" + params.umkmid);
				} else {
					toastAlert("error", "Error Submitted!", res.data.message, 3000);
				}
			});
		}
	};

	const handleUpdate = async (data) => {
		setProductid(data?.productid);
		setProductName(data?.productname);

		// Unduh gambar dari server dan konversikan ke File
		const response = await fetch(`/foto-produk/${data?.productimage}`);
		const blob = await response.blob();
		const file = new File([blob], data?.productimage, { type: blob.type });

		setProductImage(file);
	};

	const handleDelete = async (productid, image) => {
		await axios
			.delete(
				"/api/products/delete-by-product?productid=" +
					productid +
					"&image=" +
					image
			)
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", "Success Deleted!", res.data.message, 3000);
					mutate("/api/products/get-product-by-umkmid?umkid=" + params.umkmid);
				} else {
					toastAlert("error", "Error Deleted!", res.data.message, 3000);
				}
			});
	};

	return (
		<div className="flex flex-col-reverse md:flex-row gap-3">
			<Card className="basis-1/2 w-[800px] self-start">
				<DataLists
					data={productByUmkmid}
					subHeaderMemo={true}
					tableName="Manajemen Event"
					tableOptions={{
						paginator: true,
						rows: 5,
						rowsPerPageOptions: [5, 10, 50, 100],
					}}
					filterFields={["productname"]}
					columns={[
						{ field: "productname", header: "Nama Produk" },
						{
							field: "productimage",
							header: "Gambar",
							body: (rowData) => (
								<div className="flex gap-3">
									<Image
										src={"/foto-produk/" + rowData?.productimage}
										alt={rowData?.productname}
										width={1000}
										height={1000}
										className="w-[150px] h-[150px]"
									/>
								</div>
							),
						},
						{
							field: "actions",
							header: "Aksi",
							body: (rowData) => (
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => handleUpdate(rowData)}
										className={`bg-cyan-500 p-2 text-white rounded-lg hover:bg-cyan-400`}
									>
										UBAH
									</button>
									<button
										type="button"
										onClick={() =>
											handleDelete(rowData.productid, rowData.productimage)
										}
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
			<Card className="w-full self-start">
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="mb-3 text-xl font-medium">Form Produk</div>
					<hr />
					<div className="flex flex-col gap-2">
						<label className="mt-3">Masukkan Nama Produk : </label>
						<input
							type="text"
							placeholder="Nama Produk"
							value={productname}
							onChange={(e) => setProductName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="mt-3">Masukkan Foto Cover : </label>
						<input type="file" accept="image/*" onChange={handleFileChange} />
					</div>

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
