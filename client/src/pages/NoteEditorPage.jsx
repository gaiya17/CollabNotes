import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/notes/RichTextEditor";
import { createNote, getNoteById, updateNote } from "../services/noteService";

const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        setError("");
        const note = await getNoteById(id);
        setTitle(note.title || "");
        setContent(note.content || "");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditMode) {
        await updateNote(id, {
          title,
          content,
        });
      } else {
        const response = await createNote({
          title,
          content,
        });

        navigate(`/dashboard/notes/${response.note._id}`);
        return;
      }

      navigate("/dashboard/notes");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading note...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {isEditMode ? "Edit Note" : "Create Note"}
          </h2>
          <p className="mt-2 text-slate-600">
            {isEditMode
              ? "Update your note content and save changes."
              : "Write a new note and save it to your workspace."}
          </p>
        </div>

        <Link
          to="/dashboard/notes"
          className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Back to Notes
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {saving
                ? isEditMode
                  ? "Saving changes..."
                  : "Creating note..."
                : isEditMode
                ? "Save Changes"
                : "Create Note"}
            </button>

            <Link
              to="/dashboard/notes"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoteEditorPage;