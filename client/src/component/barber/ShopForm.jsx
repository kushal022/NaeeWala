export default function ShopForm({ onSubmit, defaultValues }) {
    const [form, setForm] = useState(defaultValues || {});

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form);
            }}
            className="bg-surface p-6 rounded-xl space-y-4"
        >
            <input
                className="w-full bg-bg text-text p-2 rounded"
                placeholder="Shop Name"
                value={form.shopName || ""}
                onChange={(e) =>
                    setForm({ ...form, shopName: e.target.value })
                }
            />

            <textarea
                className="w-full bg-bg text-text p-2 rounded"
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
            />

            <button className="bg-accent text-white px-4 py-2 rounded">
                Save Shop
            </button>
        </form>
    );
}
