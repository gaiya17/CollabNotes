import Note from "../models/Note.js";

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const note = await Note.create({
      title,
      content: content || "",
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all active notes accessible by the user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      isDeleted: false,
      $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    if (!note || note.isDeleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isOwner = note.owner._id.toString() === req.user._id.toString();
    const isCollaborator = note.collaborators.some(
      (collab) => collab._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note || note.isDeleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();
    const isCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;

    const updatedNote = await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Soft delete a note
// @route   DELETE /api/notes/:id
// @access  Private (owner only)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || note.isDeleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can delete this note" });
    }

    note.isDeleted = true;
    note.deletedAt = new Date();

    await note.save();

    res.status(200).json({ message: "Note moved to trash" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};