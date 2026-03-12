import { useState } from "react";
import DeleteModal from "./components/DeleteModal";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 transition"
      >
        Delete Item
      </button>

      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)} // just close modal
      />
    </div>
  );
}

export default App;
