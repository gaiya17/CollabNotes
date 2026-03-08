import { useEffect, useState } from "react";
import NoteCard from "../components/notes/NoteCard";
import { getSharedNotes } from "../services/noteService";

const SharedNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSharedNotes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSharedNotes();
      setNotes(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load shared notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Shared With Me</h2>
        <p className="mt-2 text-slate-600">
          Notes shared with you by other users.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading shared notes...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">No notes have been shared with you yet.</p>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} type="shared" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedNotesPage;