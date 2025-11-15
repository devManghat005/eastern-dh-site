export function Button({ className = "", ...props }) {
  return (
    <button
      className={"px-3 py-2 rounded-md bg-slate-700 text-white hover:bg-slate-600 " + className}
      {...props}
    />
  );
}