export default function Card({ className = "", children }) {
	return (
		<div className={`bg-white p-3 rounded-lg ${className}`}>{children}</div>
	);
}
