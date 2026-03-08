import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoteCard from "../components/notes/NoteCard";
import { deleteNote, getMyNotes } from "../services/noteService";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyNotes();
      setNotes(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Notes</h2>
          <p className="mt-2 text-slate-600">
            Create and manage your personal notes.
          </p>
        </div>

        <Link
          to="/dashboard/notes/new"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New Note
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading notes...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">You do not have any notes yet.</p>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              type="mine"
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;