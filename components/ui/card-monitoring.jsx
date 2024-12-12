export default function CardMonitoring({
	className = "",
	title,
	content,
	footer,
}) {
	return (
		<div
			className={`bg-white p-3 flex flex-col gap-4 rounded-lg border-s-4 ${className}`}
		>
			<div className="text-xl font-medium">{title}</div>
			<div className="text-sm">{content}</div>
			<small className="italic text-zinc-500">{footer}</small>
		</div>
	);
}
