// components/books/modals/AddBookModal.jsx
import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function AddBookModal({ onClose }) {
  const { token } = useUserContext();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://libarybackend.vercel.app/books/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add book");

      toast.success("Book added successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to add book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Add a New Book
          </h2>
          <button className="cursor-pointer" onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["title", "author", "isbn", "genre"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm mb-1 text-gray-700 dark:text-gray-300 capitalize"
              >
                {field}
              </label>
              <input
                type="text"
                name={field}
                id={field}
                required
                value={form[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer text-sm rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              } text-sm rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90`}
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
