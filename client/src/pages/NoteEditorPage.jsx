import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/notes/RichTextEditor";
import CollaboratorPanel from "../components/notes/CollaboratorPanel";
import {
  addCollaborator,
  createNote,
  getNoteById,
  removeCollaborator,
  updateNote,
} from "../services/noteService";
import { useAuth } from "../context/AuthContext";

const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchNote = async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      setError("");
      const noteData = await getNoteById(id);
      setNote(noteData);
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      setSuccessMessage("");

      if (isEditMode) {
        await updateNote(id, {
          title,
          content,
        });

        setSuccessMessage("Note saved successfully");
        fetchNote();
      } else {
        const response = await createNote({
          title,
          content,
        });

        navigate(`/dashboard/notes/${response.note._id}`);
        return;
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCollaborator = async (email) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await addCollaborator(id, email);
      await fetchNote();
      setSuccessMessage("Collaborator added successfully");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add collaborator");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      await removeCollaborator(id, userId);
      await fetchNote();
      setSuccessMessage("Collaborator removed successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove collaborator");
    } finally {
      setActionLoading(false);
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
              ? "Update your note content and manage collaborators."
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
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

        {isEditMode && note && (
          <CollaboratorPanel
            note={note}
            currentUser={user}
            onAddCollaborator={handleAddCollaborator}
            onRemoveCollaborator={handleRemoveCollaborator}
            actionLoading={actionLoading}
          />
        )}
      </div>
    </div>
  );
};

export default NoteEditorPage;