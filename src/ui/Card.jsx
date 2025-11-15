export function Card({ className = "", children }) {
  return (
    <div className={"rounded-xl border p-4 bg-slate-900 text-white " + className}>
      {children}
    </div>
  );
}
export function CardHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function CardTitle({ children }) { return <h2 className="text-lg font-semibold">{children}</h2>; }
export function CardContent({ children }) { return <div>{children}</div>; }
