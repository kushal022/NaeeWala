export default function StatCard({ title, value }) {
    return (
        <div className="bg-surface rounded-xl p-4">
            <p className="text-muted text-sm">{title}</p>
            <h2 className="text-text text-2xl font-bold">{value}</h2>
        </div>
    );
}
