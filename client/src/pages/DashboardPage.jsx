import { Link } from "react-router-dom";

const DashboardPage = () => {
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
          <h3 className="text-lg font-semibold text-slate-900">My Notes</h3>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage your own notes.
          </p>
          <Link
            to="/dashboard/notes"
            className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
          >
            Go to notes
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Shared With Me</h3>
          <p className="mt-2 text-sm text-slate-600">
            View notes shared by other collaborators.
          </p>
          <Link
            to="/dashboard/shared"
            className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
          >
            View shared notes
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Trash</h3>
          <p className="mt-2 text-sm text-slate-600">
            Restore notes you deleted by mistake.
          </p>
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