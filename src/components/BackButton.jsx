export default function BackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      className="absolute top-6 left-6 text-white bg-black/50 px-4 py-2 rounded-lg text-lg hover:bg-black/70 backdrop-blur-md z-50"
    >
      ← Back
    </button>
  );
}
