import Swal from "sweetalert2";

export default function Scripts() {
	// Toast
	const toastAlert = (icon, title, text, duration) => {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: duration,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer);
				toast.addEventListener("mouseleave", Swal.resumeTimer);
			},
		});

		Toast.fire({
			icon: icon,
			title: title,
			text: text,
		});
	};

	return { toastAlert };
}
