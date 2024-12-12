export default function Loading() {
	return (
		<div className="relative w-full h-screen">
			<div className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
				<i className="fa-solid fa-spinner animate-spin text-blue-500 text-4xl"></i>
			</div>
		</div>
	);
}
