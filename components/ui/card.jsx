export default function Card({ className = "", children }) {
	return (
		<div
			className={`bg-white dark:bg-zinc-950 text-black dark:text-white p-3 rounded-lg duration-500 ease-in-out ${className}`}
		>
			{children}
		</div>
	);
}
