import Navbar from "../components/layout/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            CollabNotes
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A collaborative note-taking app built with the MERN stack.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            JWT auth, rich text notes, search, collaboration, and clean workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;