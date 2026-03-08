import { Link } from "react-router-dom";

const NoteCard = ({ note, type = "default", onDelete, onRestore }) => {
  const previewText = note.content
    ?.replace(/<[^>]*>/g, "")
    ?.slice(0, 140);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {note.title}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            {previewText || "No content available."}
          </p>

          <div className="mt-4 space-y-1 text-xs text-slate-500">
            <p>Owner: {note.owner?.name || "Unknown"}</p>
            <p>
              Updated:{" "}
              {note.updatedAt
                ? new Date(note.updatedAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {type !== "trash" && (
          <Link
            to={`/dashboard/notes/${note._id}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Open
          </Link>
        )}

        {type === "mine" && (
          <button
            onClick={() => onDelete?.(note._id)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Move to Trash
          </button>
        )}

        {type === "trash" && (
          <button
            onClick={() => onRestore?.(note._id)}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;