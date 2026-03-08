import api from "./api";

export const getNotes = async ({ search = "", page = 1, limit = 10 } = {}) => {
  const response = await api.get("/notes", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
};

export const getMyNotes = async () => {
  const response = await api.get("/notes/mine");
  return response.data;
};

export const getSharedNotes = async () => {
  const response = await api.get("/notes/shared");
  return response.data;
};

export const getTrashNotes = async () => {
  const response = await api.get("/notes/trash/list");
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post("/notes", noteData);
  return response.data;
};

export const getNoteById = async (noteId) => {
  const response = await api.get(`/notes/${noteId}`);
  return response.data;
};

export const updateNote = async (noteId, noteData) => {
  const response = await api.put(`/notes/${noteId}`, noteData);
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
};

export const restoreNote = async (noteId) => {
  const response = await api.patch(`/notes/${noteId}/restore`);
  return response.data;
};