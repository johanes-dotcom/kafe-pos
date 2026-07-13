import { useMemo, useState } from "react";

const initialCategories = ["Kopi", "Non Kopi", "Makanan", "Lainnya"]; // This can be fetched from an API

const initialProducts = [
  {
    id: "P-1001",
    name: "Caffe Latte",
    category: "Kopi",
    price: 45000,
    stock: 32,
    status: "Aktif",
    image: "/icons.svg",
  },
  {
    id: "P-1002",
    name: "Americano",
    category: "Kopi",
    price: 38000,
    stock: 21,
    status: "Aktif",
    image: "/icons.svg",
  },
  {
    id: "P-1003",
    name: "Cappuccino",
    category: "Kopi",
    price: 42000,
    stock: 14,
    status: "Aktif",
    image: "/icons.svg",
  },
  {
    id: "P-1004",
    name: "Es Kopi Susu",
    category: "Kopi",
    price: 52000,
    stock: 9,
    status: "Nonaktif",
    image: "/icons.svg",
  },
  {
    id: "P-2001",
    name: "Croissant",
    category: "Makanan",
    price: 25000,
    stock: 18,
    status: "Aktif",
    image: "/icons.svg",
  },
];

function formatRupiah(amount) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }
}

function clampNumber(input, fallback = 0) {
  const n = Number(input);
  if (Number.isNaN(n)) return fallback;
  return n;
}

const actionButtonClasses = "h-9 px-3 rounded-2xl font-extrabold border transition";
const editButtonClasses = `${actionButtonClasses} bg-gray-900 hover:bg-gray-800 text-white border-gray-900`;
const deleteButtonClasses = `${actionButtonClasses} bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200`;

const ProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua"); // Semua | Aktif | Nonaktif
  const [view, setView] = useState("grid"); // grid | table

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // tambah | edit

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: initialCategories[0],
    price: 0,
    stock: 0,
    status: "Aktif",
    image: "/icons.svg",
  });

  const categoryOptions = useMemo(() => ["Semua", ...initialCategories], []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products.filter((p) => {
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchCategory = category === "Semua" ? true : p.category === category;
      const matchStatus = status === "Semua" ? true : p.status === status;

      return matchQuery && matchCategory && matchStatus;
    });
  }, [products, query, category, status]);

  const openAddModal = () => {
    setModalMode("tambah");
    setForm({
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: initialCategories[0],
      price: 0,
      stock: 0,
      status: "Aktif",
      image: "/icons.svg",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      image: product.image ?? "/icons.svg",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const validateForm = () => {
    if (!form.name.trim()) return "Nama produk wajib diisi.";
    if (!form.category.trim()) return "Kategori wajib dipilih.";
    if (clampNumber(form.price, NaN) < 0) return "Harga tidak valid.";
    if (clampNumber(form.stock, NaN) < 0) return "Stok tidak valid.";
    return null;
  };

  const handleSave = () => {
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }

    if (modalMode === "tambah") {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === form.id);
        const normalized = {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        };

        if (exists) {
          return prev.map((p) => (p.id === form.id ? normalized : p));
        }

        return [...prev, normalized];
      });
    } else {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== form.id) return p;
          return {
            ...p,
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          };
        })
      );
    }

    setIsModalOpen(false);
  };

  const handleDelete = (product) => {
    const ok = window.confirm(`Hapus produk "${product.name}" (${product.id})?`);
    if (!ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const StatChip = ({ label, variant = "neutral" }) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition duration-300";
    const cls =
      variant === "good"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : variant === "bad"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-gray-50 text-gray-700 border-gray-200";

    return <span className={`${base} ${cls}`}>{label}</span>;
  };

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-5">
        <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-3">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                <span className="text-sm font-semibold">Master Data</span>
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Menu Produk
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Kelola menu, harga, dan stok produk (front-end demo).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={[
                  "h-11 px-4 rounded-2xl border transition duration-300",
                  view === "grid"
                    ? "bg-mokkaCoffee text-white border-mokkaCoffee"
                    : "bg-white/60 border-white/70 text-gray-800 hover:bg-white",
                ].join(" ")}
              >
                Grid
              </button>

              <button
                type="button"
                onClick={() => setView("table")}
                className={[
                  "h-11 px-4 rounded-2xl border transition duration-300",
                  view === "table"
                    ? "bg-mokkaCoffee text-white border-mokkaCoffee"
                    : "bg-white/60 border-white/70 text-gray-800 hover:bg-white",
                ].join(" ")}
              >
                Tabel
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition duration-300 shadow-sm"
              >
                + Tambah Produk
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <label className="text-xs font-bold text-gray-600">Cari Nama / ID</label>
              <div className="mt-2 relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: Latte / P-1001"
                  className="w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 pr-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30 focus:border-mokkaCoffee/60"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-bold text-gray-600">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30 focus:border-mokkaCoffee/60"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-bold text-gray-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30 focus:border-mokkaCoffee/60"
              >
                {[
                  { v: "Semua", t: "Semua" },
                  { v: "Aktif", t: "Aktif" },
                  { v: "Nonaktif", t: "Nonaktif" },
                ].map((opt) => (
                  <option key={opt.v} value={opt.v}>
                    {opt.t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <img src={p.image} alt={p.name} className="h-12 w-12 rounded-2xl border border-white/60 object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-extrabold text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.id}</p>
                      </div>
                      <button
                        type="button"
                        className="h-9 w-9 rounded-xl border border-white/70 bg-white/60 hover:bg-white"
                        onClick={() => openEditModal(p)}
                        title="Edit"
                      >
                        ✎
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      <StatChip
                        label={p.status}
                        variant={p.status === "Aktif" ? "good" : p.status === "Nonaktif" ? "bad" : "neutral"}
                      />
                      <span className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                        {p.category}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-bold text-gray-900">{formatRupiah(p.price)}</p>
                      <p className="text-xs text-gray-500">Stok: {p.stock}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className={`${editButtonClasses} flex-1 h-10`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className={`${deleteButtonClasses} h-10 w-14`}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">Produk tidak ditemukan.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-white/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-2xl border border-white/60 object-cover" />
                        <div>
                          <p className="font-extrabold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-800">{p.category}</td>
                    <td className="px-4 py-4">
                      <StatChip
                        label={p.status}
                        variant={p.status === "Aktif" ? "good" : p.status === "Nonaktif" ? "bad" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{p.stock}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className={editButtonClasses}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className={deleteButtonClasses}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      Produk tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    {modalMode === "tambah" ? "Tambah Produk" : "Edit Produk"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Form ini untuk demo (front-end).</p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 w-10 rounded-2xl border border-white/70 bg-white/60 hover:bg-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600">ID Produk</label>
                  <input
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                    disabled={modalMode === "edit"}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600">Nama Produk</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Contoh: Latte"
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                  >
                    {initialCategories.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">Harga</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                    min={0}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600">Stok</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                    min={0}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 px-5 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 font-extrabold border border-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
