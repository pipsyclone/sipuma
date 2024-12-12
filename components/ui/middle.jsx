export default function Middle({ className = "", children }) {
	return (
		<div className={`relative w-full h-screen ${className}`}>
			<div className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
				{children}
			</div>
		</div>
	);
}
