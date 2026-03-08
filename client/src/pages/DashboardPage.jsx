import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyNotes, getSharedNotes, getTrashNotes } from "../services/noteService";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    myNotes: 0,
    sharedNotes: 0,
    trashNotes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [myNotes, sharedNotes, trashNotes] = await Promise.all([
          getMyNotes(),
          getSharedNotes(),
          getTrashNotes(),
        ]);

        setStats({
          myNotes: myNotes.length,
          sharedNotes: sharedNotes.length,
          trashNotes: trashNotes.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Workspace Overview</h2>
        <p className="mt-2 text-slate-600">
          Manage your notes, shared content, and deleted items from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">My Notes</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.myNotes}
          </h3>
          <Link
            to="/dashboard/notes"
            className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
          >
            Go to notes
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Shared With Me</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.sharedNotes}
          </h3>
          <Link
            to="/dashboard/shared"
            className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
          >
            View shared notes
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Trash</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stats.trashNotes}
          </h3>
          <Link
            to="/dashboard/trash"
            className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
          >
            Open trash
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;