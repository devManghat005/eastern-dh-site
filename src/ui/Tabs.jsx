import React, { useState } from "react";
export function Tabs({ defaultValue, onValueChange, children }) {
  const [value, setValue] = useState(defaultValue);
  function change(v) { setValue(v); onValueChange && onValueChange(v); }
  return React.Children.map(children, child =>
    child.type === TabsList
      ? React.cloneElement(child, { value, change })
      : child.type === TabsContent
      ? value === child.props.value && child
      : child
  );
}
export function TabsList({ children, value, change }) {
  return <div className="flex gap-2">{React.Children.map(children, child =>
    React.cloneElement(child, { active: child.props.value === value, change })
  )}</div>;
}
export function TabsTrigger({ value, active, change, children }) {
  return (
    <button onClick={() => change(value)}
      className={"px-3 py-1 rounded-md " + (active ? "bg-slate-600" : "bg-slate-800")}>
      {children}
    </button>
  );
}
export function TabsContent({ children }) { return <div className="mt-2">{children}</div>; }
