import { useState } from "react";

const CollaboratorPanel = ({
  note,
  currentUser,
  onAddCollaborator,
  onRemoveCollaborator,
  actionLoading,
}) => {
  const [email, setEmail] = useState("");

  const isOwner = note?.owner?._id === currentUser?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    const success = await onAddCollaborator(email.trim());

    if (success) {
      setEmail("");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Collaborators</h3>
      <p className="mt-2 text-sm text-slate-600">
        Manage who can access and edit this note.
      </p>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">Owner</p>
          <p className="mt-1 text-sm text-slate-600">
            {note?.owner?.name} ({note?.owner?.email})
          </p>
        </div>

        {note?.collaborators?.length > 0 ? (
          <div className="space-y-3">
            {note.collaborators.map((collaborator) => (
              <div
                key={collaborator._id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {collaborator.name}
                  </p>
                  <p className="text-sm text-slate-600">{collaborator.email}</p>
                </div>

                {isOwner && (
                  <button
                    type="button"
                    onClick={() => onRemoveCollaborator(collaborator._id)}
                    disabled={actionLoading}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No collaborators added yet.
          </div>
        )}
      </div>

      {isOwner && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Add collaborator by email
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter collaborator email"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {!isOwner && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          You can edit this shared note, but only the owner can manage collaborators.
        </div>
      )}
    </div>
  );
};

export default CollaboratorPanel;