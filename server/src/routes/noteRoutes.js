import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  getMyNotes,
  getSharedNotes,
  getTrashNotes,
  getNoteById,
  updateNote,
  deleteNote,
  restoreNote,
  addCollaborator,
  removeCollaborator,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router.get("/mine", getMyNotes);
router.get("/shared", getSharedNotes);
router.get("/trash/list", getTrashNotes);

router.route("/").post(createNote).get(getNotes);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);
router.patch("/:id/restore", restoreNote);

router.post("/:id/collaborators", addCollaborator);
router.delete("/:id/collaborators/:userId", removeCollaborator);

export default router;