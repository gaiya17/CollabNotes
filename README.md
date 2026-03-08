# CollabNotes

CollabNotes is a collaborative note-taking web application built with the MERN stack. It allows users to securely create, edit, search, and share rich text notes with collaborators.

## Features

- User registration and login with JWT authentication
- Protected frontend and backend routes
- Create, edit, and soft delete notes
- Restore deleted notes from trash
- Rich text editor for note content
- Full-text search with debounced frontend search
- Add and remove collaborators by email
- Shared notes access for collaborators
- Owner-only access control for collaborator management and deletion
- Responsive dashboard UI built with Tailwind CSS

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- React Quill New

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```bash
CollabNotes/
  client/
  server/