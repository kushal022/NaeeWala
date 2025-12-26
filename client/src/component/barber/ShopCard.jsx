export default function ShopCard({ shop, onEdit, onDelete }) {
    return (
        <div className="bg-surface p-4 rounded-xl">
            <h3 className="text-text text-lg font-semibold">
                {shop.shopName}
            </h3>

            <p className="text-muted text-sm">
                {shop.description}
            </p>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={onEdit}
                    className="text-accent"
                >
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="text-red-500"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
