"use client";
import DataLists from "@/components/ui/datatable";
import Card from "@/components/ui/card";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import Modal from "@/components/ui/modal";
import { getEvents } from "@/utils/custom-swr";
import { useSession } from "next-auth/react";
import Scripts from "@/utils/scripts";
import axios from "axios";
import Image from "next/image";

export default function Event() {
	const { data: session } = useSession();
	const { events } = getEvents();
	const { toastAlert } = Scripts();
	const [modal, setModal] = useState(false);
	const [selectedData, setSelectedData] = useState(false);

	const [eventid, setEventid] = useState("");
	const [userid] = useState(session?.user?.userid);
	const [event_name, setEventName] = useState("");
	const [event_foto, setEventFoto] = useState(null);
	const [event_date, setEventDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [event_desc, setEventDesc] = useState("");

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setEventFoto(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("eventid", eventid);
		formData.append("userid", userid);
		formData.append("event_name", event_name);
		formData.append("event_foto", event_foto);
		formData.append("event_date", event_date);
		formData.append("event_desc", event_desc);

		if (event_name === "" || event_desc === "") {
			toastAlert("warning", "Form Error!", "Form masih ada yang kosong!", 3000);
		} else if (!event_foto) {
			toastAlert("warning", "File Error!", "Harap masukkan foto cover!", 3000);
		} else {
			await axios.put("/api/events/store-event", formData).then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", "Success Submitted!", res.data.message, 3000);
				} else {
					toastAlert("error", "Error Submitted!", res.data.message, 3000);
				}
				mutate("/api/events/get-events");
			});
		}
	};

	const handleDetail = (data) => {
		setSelectedData(data);
		setModal(true);
	};

	const handleUpdate = (data) => {
		setEventid(data?.eventid);
		setEventName(data?.event_name);
		setEventFoto(data?.event_foto);
		setEventDate(data?.event_date);
		setEventDesc(data?.event_desc);
	};

	const handleDelete = async (eventid, image) => {
		await axios
			.delete(
				"/api/events/delete-by-event?eventid=" + eventid + "&image=" + image
			)
			.then((res) => {
				if (res.data.status === 200) {
					toastAlert("success", "Success Deleted!", res.data.message, 3000);
				} else {
					toastAlert("error", "Error Deleted!", res.data.message, 3000);
				}

				mutate("/api/events/get-events");
			});
	};

	return (
		<div className="flex flex-col-reverse md:flex-row gap-3">
			<Card className="basis-1/2 w-[800px] self-start">
				<DataLists
					data={events}
					subHeaderMemo={true}
					tableName="Manajemen Event"
					tableOptions={{
						paginator: true,
						rows: 5,
						rowsPerPageOptions: [5, 10, 50, 100],
					}}
					filterFields={["event_name"]}
					columns={[
						{ field: "event_name", header: "Nama Event" },
						{ field: "event_date", header: "Tanggal" },
						{
							field: "actions",
							header: "Aksi",
							body: (rowData) => (
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => handleDetail(rowData)}
										className={`bg-blue-500 p-2 text-white rounded-lg hover:bg-blue-400`}
									>
										LIHAT
									</button>
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
											handleDelete(rowData.eventid, rowData.event_foto)
										}
										className={`bg-red-500 p-2 text-white rounded-lg hover:bg-red-400`}
									>
										HAPUS
									</button>

									{modal && selectedData && (
										<Modal
											modal={modal}
											onClose={() => setModal(false)}
											title={"Event"}
										>
											<Image
												src={"/foto-events/" + selectedData.event_foto}
												alt={selectedData.event_name}
												width={1000}
												height={1000}
												className="w-auto h-[200px] mb-5 mx-auto"
											/>
											<pre>
												Nama Event : {selectedData.event_name}
												<br />
												<br />
												Deskripsi :
												<br />
												{selectedData?.event_desc}
											</pre>
										</Modal>
									)}
								</div>
							),
						},
					]}
				/>
			</Card>
			<Card className="w-full self-start">
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="mb-3 text-xl font-medium">Form Kateogori</div>
					<hr />
					<div className="flex flex-col gap-2">
						<label className="mt-3">Masukkan Nama Event : </label>
						<input
							type="text"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Nama Event"
							value={event_name}
							onChange={(e) => setEventName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="mt-3">Masukkan Foto Cover : </label>
						<input
							type="file"
							accept="image/*"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							onChange={handleFileChange}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="mt-3">Masukkan Tanggal Pelaksanaan : </label>
						<input
							type="date"
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							value={event_date}
							onChange={(e) => setEventDate(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="mt-3">Masukkan Deskripsi Kegiatan : </label>
						<textarea
							rows={7}
							className="bg-slate-200 focus:bg-white p-3 text-sm border outline-0 focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-lg duration-500 ease-in-out"
							placeholder="Masukkan Deskripsi Kegiatan Disini..."
							value={event_desc}
							onChange={(e) => setEventDesc(e.target.value)}
						></textarea>
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
