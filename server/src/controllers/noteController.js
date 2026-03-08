import mongoose from "mongoose";
import Note from "../models/Note.js";
import User from "../models/User.js";

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

// @desc    Get all active notes accessible by the user with search + pagination
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const skip = (page - 1) * limit;

    const accessFilter = {
      isDeleted: false,
      $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
    };

    let query = accessFilter;

    if (search) {
      query = {
        ...accessFilter,
        $text: { $search: search },
      };
    }

    const notes = await Note.find(query, search ? { score: { $meta: "textScore" } } : {})
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort(search ? { score: { $meta: "textScore" } } : { updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments(query);

    res.status(200).json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get only notes owned by current user
// @route   GET /api/notes/mine
// @access  Private
export const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      owner: req.user._id,
      isDeleted: false,
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get notes shared with current user
// @route   GET /api/notes/shared
// @access  Private
export const getSharedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      collaborators: req.user._id,
      isDeleted: false,
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get deleted notes owned by current user
// @route   GET /api/notes/trash/list
// @access  Private
export const getTrashNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      owner: req.user._id,
      isDeleted: true,
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort({ deletedAt: -1 });

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

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

// @desc    Restore a deleted note
// @route   PATCH /api/notes/:id/restore
// @access  Private (owner only)
export const restoreNote = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(req.params.id);

    if (!note || !note.isDeleted) {
      return res.status(404).json({ message: "Deleted note not found" });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can restore this note" });
    }

    note.isDeleted = false;
    note.deletedAt = null;

    await note.save();

    res.status(200).json({
      message: "Note restored successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add collaborator to a note by email
// @route   POST /api/notes/:id/collaborators
// @access  Private (owner only)
export const addCollaborator = async (req, res) => {
  try {
    const { email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!email) {
      return res.status(400).json({ message: "Collaborator email is required" });
    }

    const note = await Note.findById(req.params.id);

    if (!note || note.isDeleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can manage collaborators" });
    }

    const collaborator = await User.findOne({ email: email.toLowerCase() }).select("-password");

    if (!collaborator) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    if (collaborator._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot add yourself as a collaborator" });
    }

    const alreadyCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === collaborator._id.toString()
    );

    if (alreadyCollaborator) {
      return res.status(400).json({ message: "User is already a collaborator" });
    }

    note.collaborators.push(collaborator._id);
    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    res.status(200).json({
      message: "Collaborator added successfully",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove collaborator from a note
// @route   DELETE /api/notes/:id/collaborators/:userId
// @access  Private (owner only)
export const removeCollaborator = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const note = await Note.findById(id);

    if (!note || note.isDeleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isOwner = note.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Only the owner can manage collaborators" });
    }

    const isCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === userId
    );

    if (!isCollaborator) {
      return res.status(404).json({ message: "Collaborator not found on this note" });
    }

    note.collaborators = note.collaborators.filter(
      (collabId) => collabId.toString() !== userId
    );

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate("owner", "name email")
      .populate("collaborators", "name email");

    res.status(200).json({
      message: "Collaborator removed successfully",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};