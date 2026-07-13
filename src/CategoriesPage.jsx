import { useMemo, useState } from "react";

const initialCategories = [
  { id: "C-1", name: "Kopi" },
  { id: "C-2", name: "Non Kopi" },
  { id: "C-3", name: "Makanan" },
  { id: "C-4", name: "Lainnya" },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // tambah | edit

  const [form, setForm] = useState({
    id: "",
    name: "",
  });

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((c) => {
      return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });
  }, [categories, query]);

  const openAddModal = () => {
    setModalMode("tambah");
    setForm({
      id: `C-${Math.floor(10 + Math.random() * 90)}`,
      name: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setForm({
      id: category.id,
      name: category.name,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const validateForm = () => {
    if (!form.name.trim()) return "Nama kategori wajib diisi.";
    return null;
  };

  const handleSave = () => {
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }

    if (modalMode === "tambah") {
      setCategories((prev) => [...prev, form]);
    } else {
      setCategories((prev) => prev.map((c) => (c.id === form.id ? form : c)));
    }

    closeModal();
  };

  const handleDelete = (category) => {
    const ok = window.confirm(`Hapus kategori "${category.name}" (${category.id})?`);
    if (!ok) return;
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Kategori Produk</h1>
              <p className="text-sm text-gray-500 mt-2">Kelola kategori untuk menu produk Anda.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openAddModal}
                className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition duration-300 shadow-sm"
              >
                + Tambah Kategori
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
                  placeholder="Contoh: Kopi / C-1"
                  className="w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 pr-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30 focus:border-mokkaCoffee/60"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
                <th className="px-4 py-3">ID Kategori</th>
                <th className="px-4 py-3">Nama Kategori</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c.id} className="border-b border-white/50">
                  <td className="px-4 py-4 text-sm text-gray-500">{c.id}</td>
                  <td className="px-4 py-4 text-sm font-bold text-gray-800">{c.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="h-9 px-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="h-9 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold border border-rose-200 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                    Kategori tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    {modalMode === "tambah" ? "Tambah Kategori" : "Edit Kategori"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Form ini untuk demo (front-end).</p>
                </div>
                <button type="button" onClick={closeModal} className="h-10 w-10 rounded-2xl border border-white/70 bg-white/60 hover:bg-white">
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">ID Kategori</label>
                  <input value={form.id} className="mt-2 w-full h-11 rounded-2xl bg-gray-100/80 border border-gray-200/70 px-4 outline-none" disabled />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">Nama Kategori</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Contoh: Makanan Ringan"
                    className="mt-2 w-full h-11 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="h-11 px-5 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 font-extrabold border border-gray-200 transition">
                  Batal
                </button>
                <button type="button" onClick={handleSave} className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">
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

export default CategoriesPage;