import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Trash2, Save, X } from "lucide-react";
import BASE_URL from "../../config";

const ManageFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: "", answer: "" });
  const [loading, setLoading] = useState(true);

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/faqs`);
      setFaqs(data.faqs || []);
    } catch (error) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Add FAQ
  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer)
      return toast.error("Please fill all fields");

    try {
      const { data } = await axios.post(`${BASE_URL}/faqs`, newFaq);
      setFaqs([...faqs, data.faq]);
      setNewFaq({ question: "", answer: "" });
      toast.success("FAQ added successfully");
    } catch {
      toast.error("Failed to add FAQ");
    }
  };

  // Delete FAQ
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await axios.delete(`${BASE_URL}/faqs/${id}`);
      setFaqs(faqs.filter((f) => f._id !== id));
      toast.success("FAQ deleted successfully");
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  // Edit FAQ
  const startEditing = (faq) => {
    setEditingId(faq._id);
    setEditedFaq({ question: faq.question, answer: faq.answer });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedFaq({ question: "", answer: "" });
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/faqs/${id}`, editedFaq);
      setFaqs(faqs.map((f) => (f._id === id ? data.faq : f)));
      toast.success("FAQ updated successfully");
      cancelEdit();
    } catch {
      toast.error("Failed to update FAQ");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Manage FAQs</h2>

      {/* Add FAQ */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8">
        <h3 className="font-semibold mb-3">Add New FAQ</h3>
        <input
          type="text"
          placeholder="Enter question"
          value={newFaq.question}
          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
          className="w-full mb-3 border border-gray-300 rounded-lg p-2"
        />
        <textarea
          placeholder="Enter answer"
          value={newFaq.answer}
          onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
          className="w-full mb-3 border border-gray-300 rounded-lg p-2"
          rows={3}
        />
        <button
          onClick={handleAddFaq}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div>
        {loading ? (
          <p className="text-gray-500">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-gray-500 text-sm">No FAQs available.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq._id}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
              >
                {editingId === faq._id ? (
                  <>
                    <input
                      type="text"
                      value={editedFaq.question}
                      onChange={(e) =>
                        setEditedFaq({ ...editedFaq, question: e.target.value })
                      }
                      className="w-full mb-3 border border-gray-300 rounded-lg p-2"
                    />
                    <textarea
                      value={editedFaq.answer}
                      onChange={(e) =>
                        setEditedFaq({ ...editedFaq, answer: e.target.value })
                      }
                      className="w-full mb-3 border border-gray-300 rounded-lg p-2"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveEdit(faq._id)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm"
                      >
                        <Save size={16} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded-lg text-sm"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 mt-1">{faq.answer}</p>
                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => startEditing(faq)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFAQs;
